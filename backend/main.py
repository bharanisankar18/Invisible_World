import os
from typing import Any, Optional

import httpx
from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

from knowledge import OBJECTS, SYSTEM

load_dotenv()

app = FastAPI(title="InvisibleWorld agent")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://127.0.0.1:5173", "http://localhost:5173"],
    allow_methods=["*"],
    allow_headers=["*"],
)

DISCLAIMER = (
    "Teaching explanation. Distinguishes catalogue facts from simplified pictures. "
    "Simulations are hypothetical, not experiments."
)


class AgentIn(BaseModel):
    message: str = Field(min_length=1, max_length=4000)
    mode: str = "discover"
    context: Optional[dict[str, Any]] = None


def catalogue_block(ctx: Optional[dict]) -> str:
    if not ctx:
        return "No exploration context."
    oid = ctx.get("objectId")
    obj = OBJECTS.get(oid) if oid else None
    hist = ctx.get("history") or []
    lines = [
        f"zone: {ctx.get('zoneId')}",
        f"object: {ctx.get('objectName')} ({oid})",
        f"history: {hist}",
    ]
    if obj:
        lines.append(f"catalogue: {obj}")
        rel = [OBJECTS[r]["name"] for r in obj.get("related", []) if r in OBJECTS]
        lines.append(f"related names: {rel}")
    return "\n".join(str(x) for x in lines)


def local_reply(body: AgentIn) -> str:
    ctx = body.context or {}
    obj = OBJECTS.get(ctx.get("objectId") or "")
    mode = body.mode
    q = body.message.lower()

    if mode == "connect" and obj:
        rel = ", ".join(OBJECTS[r]["name"] for r in obj.get("related", []) if r in OBJECTS)
        return f"{obj['name']} connects to {rel}. Zone: {obj['zone']}. {obj['text']}"
    if mode == "curiosity":
        names = [v["name"] for k, v in OBJECTS.items() if not obj or k != ctx.get("objectId")]
        return "Next discoveries: " + "; ".join(names[:4]) + "."
    if mode == "challenge":
        target = obj or OBJECTS["atom"]
        return (
            f"Quiz: What is a typical size for {target['name']}?\n"
            f"Answer: {target['size']}\n"
            f"Bonus fact: {target['text']}"
        )
    if mode == "simulate":
        name = obj["name"] if obj else "the system"
        return (
            f"Hypothetical simulation for {name} given “{body.message}”. "
            "Changing a teaching parameter (field strength, axon length, photon wavelength) "
            "scales the qualitative effect; this is not a numerical solver or a lab method."
        )

    extra = ""
    if "atom" in q and ("see" in q or "visible" in q):
        extra = " Visible light is hundreds of nanometres; atoms are ~0.1 nm."
    if obj:
        return f"{obj['name']} ({obj['size']}). {obj['text']}{extra}"
    # keyword hunt
    for item in OBJECTS.values():
        if item["name"].split()[0].lower() in q:
            return f"{item['name']} ({item['size']}). {item['text']}{extra}"
    return f"{OBJECTS['atom']['text']}{extra} Ask about a named specimen for a tighter answer."


async def model_reply(body: AgentIn) -> Optional[str]:
    prompt = f"{SYSTEM}\n\nMode: {body.mode}\n{catalogue_block(body.context)}\n\nUser: {body.message}"
    gemini = os.getenv("GEMINI_API_KEY")
    openai = os.getenv("OPENAI_API_KEY")
    if gemini:
        url = (
            "https://generativelanguage.googleapis.com/v1beta/models/"
            "gemini-2.0-flash:generateContent"
        )
        async with httpx.AsyncClient(timeout=40) as client:
            r = await client.post(
                url,
                params={"key": gemini},
                json={"contents": [{"parts": [{"text": prompt}]}]},
            )
            r.raise_for_status()
            data = r.json()
            return data["candidates"][0]["content"]["parts"][0]["text"]
    if openai:
        async with httpx.AsyncClient(timeout=40) as client:
            r = await client.post(
                "https://api.openai.com/v1/chat/completions",
                headers={"Authorization": f"Bearer {openai}"},
                json={
                    "model": os.getenv("OPENAI_MODEL", "gpt-4o-mini"),
                    "messages": [
                        {"role": "system", "content": SYSTEM},
                        {"role": "user", "content": prompt},
                    ],
                },
            )
            r.raise_for_status()
            return r.json()["choices"][0]["message"]["content"]
    return None


@app.get("/api/health")
def health():
    return {"ok": True, "model": bool(os.getenv("GEMINI_API_KEY") or os.getenv("OPENAI_API_KEY"))}


@app.post("/api/agent")
async def agent(body: AgentIn):
    tool = body.mode if body.mode in {
        "discover",
        "connect",
        "curiosity",
        "challenge",
        "simulate",
    } else "discover"
    try:
        text = await model_reply(body)
    except Exception:
        text = None
    if not text:
        text = local_reply(body)
        source = "catalogue"
    else:
        source = "model"
    return {"reply": text, "disclaimer": DISCLAIMER, "tool": tool, "source": source}
