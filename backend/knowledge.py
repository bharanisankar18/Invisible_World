"""Curated teaching notes. Simplified. Cite as established textbook-level facts unless marked."""

OBJECTS = {
    "bacteria": {
        "name": "Bacteria",
        "size": "~1–5 µm",
        "text": "Prokaryotes without a nucleus. E. coli is about 2 µm long. Many are commensal; some pathogenic.",
        "related": ["virus", "blood-cell", "human-cell"],
        "zone": "micro",
    },
    "virus": {
        "name": "Viruses",
        "size": "~20–300 nm",
        "text": "Capsid plus DNA or RNA. Cannot replicate without a host. Influenza virions ~80–120 nm.",
        "related": ["bacteria", "rna", "human-cell"],
        "zone": "micro",
    },
    "human-cell": {
        "name": "Human cells",
        "size": "~10–30 µm",
        "text": "Eukaryotic cells with nucleus, mitochondria and cytoskeleton. Body has on the order of 30 trillion cells.",
        "related": ["blood-cell", "dna", "protein"],
        "zone": "micro",
    },
    "blood-cell": {
        "name": "Blood cells",
        "size": "~7–8 µm (RBC)",
        "text": "Biconcave erythrocytes carry haemoglobin. About 2 million new red cells per second in adults.",
        "related": ["human-cell", "bacteria", "protein"],
        "zone": "micro",
    },
    "atom": {
        "name": "Atoms",
        "size": "~1 Å",
        "text": "Dense nucleus plus electron orbitals. Visible light (~500 nm) is thousands of times longer than an atom, so ordinary optics cannot resolve them.",
        "related": ["electron", "proton", "neutron", "molecule"],
        "zone": "atomic",
    },
    "electron": {
        "name": "Electrons",
        "size": "pointlike at atomic scale",
        "text": "Lepton charge −e. In atoms they occupy wavefunctions, not planetary orbits. Mass ~1/1836 of a proton.",
        "related": ["atom", "electric-field", "proton"],
        "zone": "atomic",
    },
    "proton": {
        "name": "Protons",
        "size": "~0.84 fm",
        "text": "Charge +e. Proton count is atomic number. Hydrogen’s nucleus is one proton.",
        "related": ["neutron", "atom", "radiation"],
        "zone": "atomic",
    },
    "neutron": {
        "name": "Neutrons",
        "size": "~0.8 fm",
        "text": "Neutral baryon. Free half-life ~10 min. Bound neutrons stabilize nuclei. Carbon-14 has two extra neutrons vs carbon-12.",
        "related": ["proton", "atom", "radiation"],
        "zone": "atomic",
    },
    "molecule": {
        "name": "Molecules",
        "size": "~0.3 nm and up",
        "text": "Atoms sharing electrons. Water is bent ~104.5°. Shape governs chemistry.",
        "related": ["atom", "protein"],
        "zone": "atomic",
    },
    "dna": {
        "name": "DNA",
        "size": "2 nm wide",
        "text": "Double helix, A–T and G–C. ~3.4 nm per turn in B-DNA. Human nuclear DNA ~2 m if stretched per cell.",
        "related": ["rna", "protein", "human-cell"],
        "zone": "biological",
    },
    "rna": {
        "name": "RNA",
        "size": "~2 nm helix",
        "text": "Often single-stranded; uracil not thymine. Ribosome’s peptidyl transferase is a ribozyme.",
        "related": ["dna", "protein", "virus"],
        "zone": "biological",
    },
    "protein": {
        "name": "Proteins",
        "size": "~3–10 nm globular",
        "text": "Folded amino-acid chains. Function is 3D shape: enzymes, channels, motors.",
        "related": ["dna", "rna", "human-cell"],
        "zone": "biological",
    },
    "eukaryotic-cell": {
        "name": "Cells as systems",
        "size": "~10–30 µm",
        "text": "Organelles divide labour. Plasma membrane ~4–5 nm thick. ATP from mitochondria in animal cells.",
        "related": ["human-cell", "protein", "dna"],
        "zone": "biological",
    },
    "magnetism": {
        "name": "Magnetism",
        "size": "field (tesla)",
        "text": "B from currents and spin. Earth ~25–65 µT. Force q(v × B). No confirmed magnetic monopoles.",
        "related": ["electric-field", "em-wave", "electron"],
        "zone": "forces",
    },
    "sound": {
        "name": "Sound waves",
        "size": "needs a medium",
        "text": "Longitudinal pressure. ~343 m/s in 20 °C air. Vacuum silent. 440 Hz wavelength ~78 cm.",
        "related": ["em-wave"],
        "zone": "forces",
    },
    "em-wave": {
        "name": "Electromagnetic waves",
        "size": "λ km to pm",
        "text": "E and B oscillate, speed c in vacuum. Visible 400–700 nm. E = hc/λ.",
        "related": ["radiation", "electric-field", "magnetism"],
        "zone": "forces",
    },
    "radiation": {
        "name": "Radiation",
        "size": "eV–MeV",
        "text": "Alpha, beta, gamma, neutrons, photons. Background always present. ALARA in medicine.",
        "related": ["em-wave", "neutron", "proton"],
        "zone": "forces",
    },
    "electric-field": {
        "name": "Electric fields",
        "size": "V/m",
        "text": "F = qE. Cell membranes can exceed 10^7 V/m over nanometres. Lightning is field collapse.",
        "related": ["magnetism", "em-wave", "neuron"],
        "zone": "forces",
    },
    "neuron": {
        "name": "Neurons",
        "size": "soma 10–50 µm; axon to ~1 m",
        "text": "Rest ~−70 mV. Action potential ~1 ms. Human brain ~86 billion neurons (Azevedo 2009).",
        "related": ["synapse", "brain-signal", "network"],
        "zone": "neural",
    },
    "synapse": {
        "name": "Synapses",
        "size": "cleft 20–40 nm",
        "text": "Vesicles ~40 nm. Chemical delay ~0.5–1 ms. Strength changes with use.",
        "related": ["neuron", "brain-signal", "protein"],
        "zone": "neural",
    },
    "brain-signal": {
        "name": "Brain signals",
        "size": "ms · µV–mV",
        "text": "Spike is local and fast. EEG is summed and smeared. fMRI tracks blood oxygen, not spikes.",
        "related": ["neuron", "synapse", "electric-field"],
        "zone": "neural",
    },
    "network": {
        "name": "Neural connections",
        "size": "order 10^14 synapses",
        "text": "C. elegans connectome is complete (302 neurons). Human synapse-scale maps remain incomplete.",
        "related": ["neuron", "synapse", "brain-signal"],
        "zone": "neural",
    },
    "communication": {
        "name": "Cell-to-cell talk",
        "size": "chemical + electrical",
        "text": "Spike → Ca²⁺ → vesicle fusion → transmitter → PSP. Glutamate excitatory, GABA inhibitory in cortex.",
        "related": ["synapse", "neuron", "brain-signal"],
        "zone": "neural",
    },
}

SYSTEM = """You are the InvisibleWorld science guide for curious non-specialists.
Rules:
- Use the catalogue facts when relevant. Speak plainly. No hype words (unlock, seamless, revolutionize).
- Mark simplified teaching models vs established measurements.
- Never give lab protocols for making pathogens, weapons, or radiation devices. Conceptual physics/biology only.
- If unsure, say so. Do not invent citations.
- Modes: discover (explain object), connect (relationships), curiosity (what to explore next), challenge (short quiz), simulate (qualitative thought experiment, labelled hypothetical).
"""
