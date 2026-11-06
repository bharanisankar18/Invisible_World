# InvisibleWorld

An interactive science site for students. Build any of the first 36 atoms in 3D, watch its electron clouds and nucleus, make an electron jump and see the light it gives out, then zoom from a human hair down to a nucleus.

## Run

Frontend:

```bash
npm install
npm run dev
```

Backend (optional live model; catalogue answers work without keys):

```bash
cd backend
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
copy .env.example .env
uvicorn main:app --reload --port 8000
```

Vite proxies `/api` to `http://127.0.0.1:8000`. Put `GEMINI_API_KEY` or `OPENAI_API_KEY` in `backend/.env` only.

## Stack

React, Tailwind CSS v4, Framer Motion, Three.js 0.185.1 with React Three Fiber, FastAPI. Design system: see DESIGN.md. One science agent with discover / connect / curiosity / challenge / simulate modes.
