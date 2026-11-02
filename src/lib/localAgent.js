import { OBJECTS, ZONES, getObject } from "../data/catalog.js";

const DISCLAIMER =
  "Established teaching facts from the on-site catalogue. Simplified. Not a substitute for a textbook or clinical advice. Simulations are hypothetical.";

function discover(object, message) {
  if (!object) {
    return `No specimen is selected. Browse a zone first, or ask about DNA, neurons, magnetic fields, or viruses.\n\nYou asked: “${message}”`;
  }
  return `${object.name} (${object.sizeLabel})\n\n${object.description}\n\nStructure: ${object.structure}\n\n${object.facts[0]}`;
}

function connect(object) {
  const related = (object?.related || [])
    .map((id) => getObject(id))
    .filter(Boolean)
    .map((o) => `${o.name}: ${o.subtitle}`)
    .join("\n");
  if (!object) {
    return "Pick an object to map its neighbours. Example: atom relates to electrons, protons, neutrons and molecules.";
  }
  return `${object.name} sits in the ${object.zone} zone.\n\nLinked catalogue entries:\n${related}`;
}

function curiosity(object, zoneId) {
  const pool = OBJECTS.filter((o) => o.id !== object?.id && (o.zone === zoneId || o.zone === object?.zone));
  const pick = pool.slice(0, 3);
  const extra = OBJECTS.find((o) => o.zone !== (object?.zone || zoneId));
  const lines = [...pick, extra].filter(Boolean).map((o) => `→ ${o.name} — ${o.subtitle}`);
  return `Next stops worth a look:\n${lines.join("\n")}\n\nThe catalogue is finite; curiosity is not.`;
}

function challenge(object) {
  const o = object || OBJECTS[0];
  return `Quiz (one item)\n\nQ: Typical size of ${o.name}?\nA (reveal): ${o.sizeLabel}\n\nQ2: ${o.facts[0]}\nTrue or teaching-simplification? Mostly established; wording is simplified for this floor.`;
}

function simulate(object, message) {
  const topic = object?.name || "this system";
  return `Thought experiment about ${topic}, not a lab procedure.\n\nIf you change a parameter named in “${message}”, effects are qualitative:\n• Scale: shrinking the observer does not grant optical resolution below ~λ/2 of the light used.\n• Fields: doubling a current roughly doubles B in a simple loop (Biot–Savart teaching limit).\n• Spikes: raising sodium conductance in Hodgkin–Huxley-like intuition makes the upstroke faster — a model, not a prescription.\n\nHypothetical. Do not treat as experimental advice.`;
}

export function localAgentReply({ message, mode, context }) {
  const object = context?.objectId ? getObject(context.objectId) : null;
  const zone = ZONES.find((z) => z.id === context?.zoneId);
  void zone;
  const tool = mode || "discover";
  let reply;
  if (tool === "connect") reply = connect(object);
  else if (tool === "curiosity") reply = curiosity(object, context?.zoneId);
  else if (tool === "challenge") reply = challenge(object);
  else if (tool === "simulate") reply = simulate(object, message);
  else reply = discover(object, message);

  const lower = message.toLowerCase();
  if (lower.includes("see atom") || lower.includes("can't we see") || lower.includes("cannot see")) {
    reply +=
      "\n\nWhy atoms are invisible: visible light is ~400–700 nm. An atom is ~0.1 nm. Diffraction bars ordinary optics. STM and TEM are different instruments, not 'better eyes'.";
  }
  if (lower.includes("neuron")) {
    const n = getObject("neuron");
    reply += `\n\n${n.facts[0]} ${n.structure}`;
  }
  if (lower.includes("magnetic") || lower.includes("magnet")) {
    const m = getObject("magnetism");
    reply += `\n\n${m.description}`;
  }
  if (lower.includes("human cell") || lower.includes("inside a")) {
    const c = getObject("eukaryotic-cell");
    reply += `\n\n${c.description}`;
  }

  return { reply, disclaimer: DISCLAIMER, tool };
}
