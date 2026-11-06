export const ZONES = [
  {
    id: "micro",
    name: "Micro World",
    scale: "10⁻⁶ m",
    lead: "Life that shares your skin, blood and breath.",
    blurb:
      "A typical bacterium is about 1–5 micrometres long. A red blood cell is roughly 8 micrometres across. Neither is visible without optics.",
  },
  {
    id: "atomic",
    name: "Atomic World",
    scale: "10⁻¹⁰ m",
    lead: "The architecture of matter itself.",
    blurb:
      "A hydrogen atom is about 1 ångström (0.1 nanometre) across. Atoms are not tiny billiard balls; they are quantum systems with a dense nucleus and a probability cloud of electrons.",
  },
  {
    id: "biological",
    name: "Biological World",
    scale: "10⁻⁹ m",
    lead: "Molecules that copy, fold and keep you alive.",
    blurb:
      "DNA in a human cell nucleus is about 2 nanometres wide and, if stretched, roughly two metres long. Proteins fold from amino-acid chains into machines.",
  },
  {
    id: "forces",
    name: "Invisible Forces",
    scale: "fields",
    lead: "Influences you feel without seeing the field.",
    blurb:
      "Sound is pressure. Light is an electromagnetic wave. Magnetism is a field produced by moving charges. Radiation is energy or particles leaving a source.",
  },
  {
    id: "neural",
    name: "Neural World",
    scale: "ms · mV",
    lead: "Electrical gossip between cells that think.",
    blurb:
      "A neuron fires an action potential in about a millisecond. Synapses convert that spike into chemical packets, then back into voltage in the next cell.",
  },
];

export const OBJECTS = [
  {
    id: "bacteria",
    zone: "micro",
    name: "Bacteria",
    subtitle: "Single-celled prokaryotes",
    sizeMeters: 2e-6,
    sizeLabel: "~1–5 µm",
    viz: "bacteria",
    structure:
      "No nucleus. DNA sits in a nucleoid. A cell wall (often peptidoglycan) surrounds a plasma membrane. Many species have flagella.",
    description:
      "Bacteria are prokaryotes: cells without a membrane-bound nucleus. They live in soil, oceans, your gut and on your skin. Most are harmless or helpful; a minority cause disease.",
    facts: [
      "Escherichia coli is about 2 µm long and 0.5 µm wide.",
      "A gram of soil can hold 10⁸–10⁹ bacterial cells.",
      "Some bacteria form spores that survive heat and drought.",
    ],
    related: ["virus", "blood-cell", "human-cell"],
    mysteryPrompt: "A rod-shaped cell with no nucleus, about 2 micrometres long.",
  },
  {
    id: "virus",
    zone: "micro",
    name: "Viruses",
    subtitle: "Genetic packages, not cells",
    sizeMeters: 1e-7,
    sizeLabel: "~20–300 nm",
    viz: "virus",
    structure:
      "A capsid of protein subunits encloses DNA or RNA. Some viruses add a lipid envelope stolen from a host cell. They have no ribosomes of their own.",
    description:
      "Viruses cannot copy themselves. They hijack a host cell’s machinery. A typical influenza virion is about 80–120 nm across — smaller than most bacteria.",
    facts: [
      "Tobacco mosaic virus was the first virus identified (1890s).",
      "Bacteriophages infect bacteria and often look like lunar landers.",
      "Viruses sit at the edge of definitions of life: they evolve, but they are not cells.",
    ],
    related: ["bacteria", "rna", "human-cell"],
    mysteryPrompt: "A protein shell around RNA, roughly 100 nanometres wide, unable to copy itself.",
  },
  {
    id: "human-cell",
    zone: "micro",
    name: "Human cells",
    subtitle: "Eukaryotic workshops",
    sizeMeters: 2e-5,
    sizeLabel: "~10–30 µm",
    viz: "cell",
    structure:
      "A nucleus holds chromosomes. Mitochondria make ATP. The endoplasmic reticulum and Golgi process proteins. A cytoskeleton of filaments holds shape.",
    description:
      "The human body has on the order of 30 trillion cells of hundreds of types. A typical animal cell is tens of micrometres across — about the width of a fine human hair’s thinner cousins, still invisible unaided.",
    facts: [
      "A hepatocyte (liver cell) is packed with mitochondria and smooth ER.",
      "Red blood cells lose their nucleus as they mature; most other human cells keep one.",
      "If you lined up 50 typical cells, you would span about 1 millimetre.",
    ],
    related: ["blood-cell", "dna", "protein"],
    mysteryPrompt: "A eukaryotic cell with a nucleus, mitochondria and a cytoskeleton, tens of micrometres wide.",
  },
  {
    id: "blood-cell",
    zone: "micro",
    name: "Blood cells",
    subtitle: "Oxygen discs and immune patrols",
    sizeMeters: 8e-6,
    sizeLabel: "~7–8 µm (RBC)",
    viz: "blood",
    structure:
      "Erythrocytes are biconcave discs packed with haemoglobin. Leukocytes have nuclei and hunt pathogens. Platelets are cell fragments that plug leaks.",
    description:
      "A drop of blood is a crowd. Red cells carry oxygen. White cells defend. Platelets clot. A red cell is about 8 µm across and 2 µm thick — just below the resolution of a sharp unaided eye.",
    facts: [
      "Adult humans make about 2 million new red cells per second.",
      "A red cell circulates for roughly 120 days.",
      "White cells are fewer but far more diverse in job and shape.",
    ],
    related: ["human-cell", "bacteria", "protein"],
    mysteryPrompt: "A biconcave disc about 8 micrometres across, filled with haemoglobin, no nucleus.",
  },
  {
    id: "microorganism",
    zone: "micro",
    name: "Microorganisms",
    subtitle: "The mixed kingdom under the slide",
    sizeMeters: 5e-5,
    sizeLabel: "~5–100 µm",
    viz: "microbe",
    structure:
      "The term covers bacteria, archaea, many fungi, protists and microscopic animals. Sizes and cell plans differ wildly; the shared trait is that you need a microscope.",
    description:
      "Pond water is a city: amoebae, ciliates, algae, rotifers. Some are single cells; some are tiny animals. A paramecium can be 50–300 µm — still a glint, not a creature, to the naked eye.",
    facts: [
      "Antonie van Leeuwenhoek described “animalcules” in the 1670s.",
      "Phytoplankton produce a large share of Earth’s oxygen.",
      "Tardigrades (water bears) are animals, not microbes, but many species are microscopic.",
    ],
    related: ["bacteria", "human-cell", "virus"],
    mysteryPrompt: "A pond-dwelling ciliate tens of micrometres long, covered in beating hairs.",
  },
  {
    id: "atom",
    zone: "atomic",
    name: "Atoms",
    subtitle: "The chemical identity of matter",
    sizeMeters: 1e-10,
    sizeLabel: "~1 Å (0.1 nm)",
    viz: "atom",
    structure:
      "A tiny, dense nucleus of protons and neutrons, surrounded by electrons in quantum orbitals — not little planets on rails.",
    description:
      "If an atom were a football stadium, the nucleus would be a pea on the pitch. Chemical identity is set by proton count (atomic number). The electron cloud sets bonding and size.",
    facts: [
      "A hydrogen atom’s Bohr radius is 0.529 Å — a useful scale, not a hard shell.",
      "Most of an atom’s volume is empty of particle-like mass; fields fill it.",
      "You cannot see an atom with visible light; the wavelength is thousands of times larger.",
    ],
    related: ["electron", "proton", "neutron", "molecule"],
    mysteryPrompt: "A system about 0.1 nanometres across: dense nucleus, electron cloud, empty-looking volume.",
  },
  {
    id: "electron",
    zone: "atomic",
    name: "Electrons",
    subtitle: "Charge carriers of chemistry",
    sizeMeters: 2.8e-15,
    sizeLabel: "pointlike (classical radius ~2.8 fm)",
    viz: "electron",
    structure:
      "Elementary lepton with charge −1e and spin 1/2. In atoms they occupy orbitals described by a wavefunction. They are not little marbles orbiting.",
    description:
      "Electric current in a wire is a slow drift of electrons. Chemistry is the rearrangement of electron clouds. In quantum mechanics an electron in an atom is a standing wave of probability.",
    facts: [
      "Electron rest mass is about 9.11 × 10⁻³¹ kg, ~1/1836 of a proton.",
      "The classical electron radius is a model, not a measured hard size.",
      "Electron microscopes use their short de Broglie wavelength to image nanometre features.",
    ],
    related: ["atom", "electric-field", "proton"],
    mysteryPrompt: "A spin-1/2 particle with negative charge that occupies orbitals, not circular tracks.",
  },
  {
    id: "proton",
    zone: "atomic",
    name: "Protons",
    subtitle: "Positive charge in the nucleus",
    sizeMeters: 8.4e-16,
    sizeLabel: "~0.84 fm radius",
    viz: "proton",
    structure:
      "A composite baryon of two up quarks and one down quark, held by the strong force via gluons. Charge +1e.",
    description:
      "The number of protons names the element: 1 hydrogen, 6 carbon, 26 iron. Protons are about a femtometre across — 100,000 times smaller than the atom they sit in.",
    facts: [
      "Proton mass ≈ 1.673 × 10⁻²⁷ kg.",
      "The proton radius puzzle is a real measurement debate in physics.",
      "Hydrogen’s nucleus is a single proton.",
    ],
    related: ["neutron", "atom", "radiation"],
    mysteryPrompt: "A femtometre-scale baryon whose count defines the chemical element.",
  },
  {
    id: "neutron",
    zone: "atomic",
    name: "Neutrons",
    subtitle: "Nuclear mass without charge",
    sizeMeters: 8.4e-16,
    sizeLabel: "~0.8 fm",
    viz: "neutron",
    structure:
      "A baryon of one up quark and two down quarks. Electrically neutral. Free neutrons decay with a half-life of about 10 minutes.",
    description:
      "Neutrons glue nuclei together against proton repulsion. Isotopes of an element differ in neutron count. Carbon-12 has six neutrons; carbon-14 has eight and is radioactive.",
    facts: [
      "Neutron mass is slightly larger than the proton’s.",
      "Neutron radiation is hard to shield: no charge, so it does not ionize until it hits a nucleus.",
      "Inside stable nuclei, neutrons can last billions of years.",
    ],
    related: ["proton", "atom", "radiation"],
    mysteryPrompt: "An uncharged nuclear particle; free, it decays in minutes; bound, it can last eons.",
  },
  {
    id: "molecule",
    zone: "atomic",
    name: "Molecules",
    subtitle: "Atoms sharing electrons",
    sizeMeters: 3e-10,
    sizeLabel: "~0.3–several nm",
    viz: "molecule",
    structure:
      "Atoms linked by covalent bonds (shared electron pairs) or held in larger assemblies by weaker forces. Geometry is set by orbital overlap.",
    description:
      "Water is H₂O: two hydrogens and one oxygen, bent at about 104.5°. A protein is a macromolecule of thousands of atoms. Molecular size starts near an ångström and climbs into nanometres.",
    facts: [
      "A water molecule is about 0.27 nm across.",
      "Avogadro’s number (~6.022 × 10²³) counts molecules in a mole.",
      "Molecular shape, not just formula, decides smell, drug binding and material strength.",
    ],
    related: ["atom", "protein", "molecular-structure"],
    mysteryPrompt: "A bent trio of atoms, about 0.27 nanometres across, that makes liquid water.",
  },
  {
    id: "dna",
    zone: "biological",
    name: "DNA",
    subtitle: "Double helix of bases",
    sizeMeters: 2e-9,
    sizeLabel: "2 nm wide",
    viz: "dna",
    structure:
      "Two antiparallel strands of sugar-phosphate backbone. Bases pair A–T and G–C. One helical turn is about 3.4 nm and 10.5 base pairs in B-DNA.",
    description:
      "DNA stores genetic instructions as a four-letter sequence. In humans, nuclear DNA is packed into 46 chromosomes. Stretched end to end, one cell’s DNA is about two metres long.",
    facts: [
      "Watson and Crick (1953) used Franklin and Wilkins’ X-ray data.",
      "The major and minor grooves are where proteins read sequence.",
      "Mitochondria keep their own small circular DNA.",
    ],
    related: ["rna", "protein", "human-cell"],
    mysteryPrompt: "A 2-nanometre-wide helix with A–T and G–C pairs, about 3.4 nanometres per turn.",
  },
  {
    id: "rna",
    zone: "biological",
    name: "RNA",
    subtitle: "Messenger, machine and sometimes genome",
    sizeMeters: 2e-9,
    sizeLabel: "~2 nm (A-form helix)",
    viz: "rna",
    structure:
      "Usually single-stranded. Uses uracil instead of thymine. Can fold into catalytic shapes (ribozymes). mRNA, tRNA and rRNA have different jobs.",
    description:
      "Transcription copies a DNA gene into messenger RNA. Ribosomes, themselves mostly RNA, translate mRNA into protein. Some viruses use RNA as their genome.",
    facts: [
      "The ribosome’s peptidyl transferase centre is a ribozyme.",
      "tRNA is an L-shaped adapter about 76 nucleotides long.",
      "mRNA vaccines deliver instructions, not a live virus.",
    ],
    related: ["dna", "protein", "virus"],
    mysteryPrompt: "A nucleic acid that uses uracil, often single-stranded, and can catalyse peptide-bond formation.",
  },
  {
    id: "protein",
    zone: "biological",
    name: "Proteins",
    subtitle: "Folded amino-acid machines",
    sizeMeters: 5e-9,
    sizeLabel: "~3–10 nm (typical globular)",
    viz: "protein",
    structure:
      "A polypeptide chain folds into helices, sheets and loops. Function lives in 3D shape: active sites, channels, motors, antibodies.",
    description:
      "Haemoglobin, antibodies, ion channels and the enzymes of metabolism are proteins. A small globular protein is a few nanometres across — visible to cryo-EM, not to your eye.",
    facts: [
      "Twenty standard amino acids encode most proteins.",
      "Misfolding is implicated in several neurodegenerative diseases.",
      "ATP synthase is a rotary protein motor in mitochondria.",
    ],
    related: ["dna", "rna", "human-cell"],
    mysteryPrompt: "A nanometre-scale folded chain of amino acids whose shape is its function.",
  },
  {
    id: "eukaryotic-cell",
    zone: "biological",
    name: "Cells as systems",
    subtitle: "Compartments that traffic molecules",
    sizeMeters: 2e-5,
    sizeLabel: "~10–30 µm",
    viz: "cell",
    structure:
      "Membrane-bound organelles divide labour. Vesicles move cargo. The cytoskeleton is both scaffold and railway. Energy is ATP, mostly from mitochondria in animal cells.",
    description:
      "A cell is not a bag of soup. It is a logistics network. Transcription in the nucleus, translation on ribosomes, folding in the ER, shipping through the Golgi — all on a micrometre stage.",
    facts: [
      "A typical protein synthesis cycle takes seconds to minutes, not hours.",
      "The plasma membrane is a fluid mosaic of lipids and proteins ~4–5 nm thick.",
      "Apoptosis is a programmed cell-death pathway, not random bursting.",
    ],
    related: ["human-cell", "protein", "dna"],
    mysteryPrompt: "A micrometre-scale logistics network with nucleus, ER, Golgi and mitochondria.",
  },
  {
    id: "molecular-structure",
    zone: "biological",
    name: "Molecular structures",
    subtitle: "Shape at the nanometre",
    sizeMeters: 1e-8,
    sizeLabel: "~5–20 nm complexes",
    viz: "complex",
    structure:
      "Assemblies such as the nuclear pore, the proteasome and photosystem II are multi-protein machines with moving parts, pores and reaction centres.",
    description:
      "Biology at this scale is architecture. A nuclear pore is a ~100 nm gate. A ribosome is ~20–30 nm. Cryo-electron microscopy now resolves many of these machines near atomic detail.",
    facts: [
      "The nuclear pore complex is among the largest protein assemblies in the cell.",
      "Photosystem II splits water using light — the origin of most atmospheric oxygen.",
      "These sizes are measured by scattering, microscopy and crystallography, not by a classroom ruler.",
    ],
    related: ["protein", "dna", "human-cell"],
    mysteryPrompt: "A multi-protein gate tens of nanometres wide that controls traffic into a nucleus.",
  },
  {
    id: "magnetism",
    zone: "forces",
    name: "Magnetism",
    subtitle: "Fields from moving charge and spin",
    sizeMeters: null,
    sizeLabel: "field (tesla)",
    viz: "magnet",
    structure:
      "A magnetic field B is a vector field. In matter, electron spin and orbital motion can align (ferromagnets). Moving charges produce B; changing B produces electric fields (Faraday).",
    description:
      "You never see a magnetic field; you see iron filings, compass needles, or a motor turning. Earth’s field is about 25–65 microtesla. An MRI scanner is typically 1.5–3 tesla.",
    facts: [
      "There are no isolated magnetic monopoles in confirmed experiments.",
      "Magnetic force on a charge is q(v × B): no force if velocity is parallel to B.",
      "Lodestone (magnetite) was used as a compass in antiquity.",
    ],
    related: ["electric-field", "em-wave", "electron"],
    mysteryPrompt: "A vector field measured in tesla, produced by currents and electron spin, never seen directly.",
  },
  {
    id: "sound",
    zone: "forces",
    name: "Sound waves",
    subtitle: "Pressure in a medium",
    sizeMeters: null,
    sizeLabel: "wavelength ~cm–m in air",
    viz: "sound",
    structure:
      "Longitudinal compression waves. Frequency is pitch; amplitude relates to loudness. In air at 20 °C, speed ≈ 343 m/s. No air, no sound.",
    description:
      "A 440 Hz A4 note has a wavelength of about 78 cm in air. Ultrasound used in medicine is typically 1–15 MHz, with millimetre to sub-millimetre wavelengths in tissue.",
    facts: [
      "Sound needs a medium; electromagnetic waves do not.",
      "The decibel scale is logarithmic: +10 dB is ten times the intensity.",
      "Bats and dolphins echolocate with ultrasound.",
    ],
    related: ["em-wave", "electric-field"],
    mysteryPrompt: "A longitudinal pressure wave that cannot travel in vacuum, ~343 metres per second in room air.",
  },
  {
    id: "em-wave",
    zone: "forces",
    name: "Electromagnetic waves",
    subtitle: "Oscillating E and B, no medium required",
    sizeMeters: null,
    sizeLabel: "λ from km to pm",
    viz: "em",
    structure:
      "Transverse waves of electric and magnetic fields, speed c in vacuum (299,792,458 m/s). Radio, microwave, infrared, visible, ultraviolet, X-ray and gamma differ only in wavelength.",
    description:
      "Visible light is a thin slice: about 400–700 nm. You see that band because photopigments in the retina absorb those photons. Radio and X-rays are the same kind of wave, different scale.",
    facts: [
      "Maxwell’s equations predicted electromagnetic waves before Hertz generated them.",
      "Photon energy E = hc/λ: shorter wavelength means higher energy.",
      "Most of the electromagnetic spectrum is invisible to human eyes.",
    ],
    related: ["radiation", "electric-field", "magnetism"],
    mysteryPrompt: "A transverse wave that travels at c in vacuum; visible light is only 400–700 nanometres of it.",
  },
  {
    id: "radiation",
    zone: "forces",
    name: "Radiation",
    subtitle: "Energy or particles leaving a source",
    sizeMeters: null,
    sizeLabel: "energy (eV–MeV)",
    viz: "radiation",
    structure:
      "Ionizing radiation includes alpha (helium nuclei), beta (electrons/positrons), gamma (photons), X-rays and neutrons. Non-ionizing includes radio, microwave and most visible light.",
    description:
      "Radiation is not one substance. Alpha is stopped by paper. Beta needs plastic or thin metal. Gamma needs dense shielding. Dose is measured in sieverts, activity in becquerels.",
    facts: [
      "Background radiation is always present: rocks, cosmic rays, potassium-40 in you.",
      "UV-C is ionizing enough to damage DNA; Earth’s ozone layer blocks most of it.",
      "Medical imaging doses are kept as low as reasonably achievable (ALARA).",
    ],
    related: ["em-wave", "neutron", "proton"],
    mysteryPrompt: "A helium nucleus ejected from a heavy atom, stopped by a sheet of paper, highly ionizing up close.",
  },
  {
    id: "electric-field",
    zone: "forces",
    name: "Electric fields",
    subtitle: "Force per unit charge",
    sizeMeters: null,
    sizeLabel: "field (V/m)",
    viz: "efield",
    structure:
      "E points from positive to negative potential. A charge q feels force F = qE. Changing magnetic fields induce electric fields. Static fields exist around any separated charge.",
    description:
      "A lightning strike is a sudden collapse of a huge electric field between cloud and ground. Nerve cells use millivolt fields across nanometre membranes. You feel neither field; you see the spark or the twitch.",
    facts: [
      "Fair-weather atmospheric field near ground is ~100 V/m.",
      "A cell membrane field can exceed 10⁷ V/m — huge, over a few nanometres.",
      "Faraday cages cancel interior static electric fields.",
    ],
    related: ["magnetism", "em-wave", "neuron"],
    mysteryPrompt: "A vector field in volts per metre; a cell membrane packs an enormous one into a few nanometres.",
  },
  {
    id: "neuron",
    zone: "neural",
    name: "Neurons",
    subtitle: "Cells that spike",
    sizeMeters: 1e-5,
    sizeLabel: "soma ~10–50 µm; axon up to ~1 m",
    viz: "neuron",
    structure:
      "Dendrites collect input. The soma integrates. The axon carries action potentials. Myelin in vertebrates speeds conduction. Terminals release transmitter.",
    description:
      "A neuron is a cell specialised for voltage. Resting potential is typically around −70 mV. When threshold is crossed, sodium and potassium channels open in a travelling wave — the spike.",
    facts: [
      "The human brain has on the order of 86 billion neurons (Azevedo et al., 2009).",
      "A motor axon to your foot can be about a metre long.",
      "Not all neurons spike in the textbook way; some are graded or bursting.",
    ],
    related: ["synapse", "brain-signal", "network"],
    mysteryPrompt: "A cell with dendrites, a millivolt resting potential, and an axon that can be a metre long.",
  },
  {
    id: "synapse",
    zone: "neural",
    name: "Synapses",
    subtitle: "Chemical and electrical junctions",
    sizeMeters: 2e-8,
    sizeLabel: "cleft ~20–40 nm",
    viz: "synapse",
    structure:
      "At a chemical synapse, vesicles dump transmitter into a 20–40 nm cleft. Receptors on the far side open ion channels. Electrical synapses (gap junctions) share cytoplasm more directly.",
    description:
      "Thought is not a spark jumping a wire. It is a timed chemical handshake. One cortical neuron may have thousands of synapses. Strength changes with use — a physical basis of learning.",
    facts: [
      "A synaptic vesicle is about 40 nm across.",
      "Typical chemical delay is about 0.5–1 ms.",
      "Neuromodulators like dopamine often act more diffusely than fast glutamate.",
    ],
    related: ["neuron", "brain-signal", "protein"],
    mysteryPrompt: "A 20–40 nanometre gap where vesicles release transmitter onto receptors.",
  },
  {
    id: "brain-signal",
    zone: "neural",
    name: "Brain signals",
    subtitle: "Voltage in time",
    sizeMeters: null,
    sizeLabel: "ms · µV–mV",
    viz: "signal",
    structure:
      "An action potential is a ~1 ms, ~100 mV excursion at the membrane. EEG at the scalp records microvolt sums of many synapses. fMRI tracks delayed blood-oxygen changes, not spikes.",
    description:
      "A ‘brain signal’ is several phenomena people mix together. Spikes are fast and local. EEG is slow, smeared and safe. Imaging is slower still. None of them is a photograph of a thought.",
    facts: [
      "Hodgkin and Huxley modelled the squid axon spike in 1952.",
      "EEG alpha rhythm is about 8–12 Hz, often stronger with eyes closed.",
      "A spike travels along a myelinated axon at up to ~100 m/s in humans.",
    ],
    related: ["neuron", "synapse", "electric-field"],
    mysteryPrompt: "A ~1 millisecond, ~100 millivolt travelling wave along an axon membrane.",
  },
  {
    id: "network",
    zone: "neural",
    name: "Neural connections",
    subtitle: "Graphs of cells",
    sizeMeters: null,
    sizeLabel: "10¹⁴ synapses (order of)",
    viz: "network",
    structure:
      "Connectomes are maps of who talks to whom. Local circuits (columns, ganglia) embed in long-range tracts. Weight, delay and plasticity matter as much as the wiring diagram.",
    description:
      "The brain is not a soup and not a CPU. It is a sparse, plastic, three-dimensional network. C. elegans has 302 neurons mapped completely. A human connectome at synapse scale is still a research frontier.",
    facts: [
      "White-matter tracts are bundled axons, visible on diffusion MRI.",
      "Small-world statistics appear in many brain graphs: clustered locally, short global paths.",
      "Maps are models; they omit neuromodulation and glia.",
    ],
    related: ["neuron", "synapse", "brain-signal"],
    mysteryPrompt: "A sparse, plastic graph of cells; fully mapped in a worm, still incomplete in humans.",
  },
  {
    id: "communication",
    zone: "neural",
    name: "Cell-to-cell talk",
    subtitle: "From spike to meaning",
    sizeMeters: null,
    sizeLabel: "chemical + electrical",
    viz: "talk",
    structure:
      "Sequence: spike arrives → calcium enters terminal → vesicles fuse → transmitter binds → postsynaptic potential → maybe another spike. Glia and extrasynaptic receptors join the conversation.",
    description:
      "Communication between brain cells is a stack: ions, synapses, circuits, rhythms. No single layer is ‘the thought’. Simplified animations show one axon, one synapse, one next cell — a real motif, not the whole organ.",
    facts: [
      "Glutamate is the main fast excitatory transmitter in cortex.",
      "GABA is the main fast inhibitory transmitter in cortex.",
      "Astrocytes clear transmitter and regulate blood flow; they are not silent packing material.",
    ],
    related: ["synapse", "neuron", "brain-signal"],
    mysteryPrompt: "A cascade: calcium, vesicle fusion, glutamate, a postsynaptic potential, maybe a new spike.",
  },
];

export const SCALE_STEPS = [
  {
    id: "human",
    label: "Human scale",
    meters: 1,
    display: "1 m",
    title: "A person, a stride, a table",
    fact: "Your unaided eye resolves details of about 0.1 mm in good light — a hundred micrometres, still huge compared with a cell.",
    objects: ["hair-ref"],
    note: "Illustrative scene. Not a photograph of a specific person.",
  },
  {
    id: "milli",
    label: "Millimetre",
    meters: 1e-3,
    display: "1 mm",
    title: "Hair, mites, printed dots",
    fact: "A human scalp hair is typically 50–100 µm thick, so a millimetre holds about 10–20 hair diameters.",
    objects: ["hair-ref", "microorganism"],
    note: "Sizes are typical ranges, not a single measured specimen.",
  },
  {
    id: "micro",
    label: "Micrometre",
    meters: 1e-6,
    display: "1 µm",
    title: "Cells and bacteria",
    fact: "A red blood cell (~8 µm) would span this tick eight times. E. coli (~2 µm) would span it twice.",
    objects: ["blood-cell", "bacteria", "human-cell"],
    note: "Cell drawings are schematics, not microscope captures.",
  },
  {
    id: "nano",
    label: "Nanometre",
    meters: 1e-9,
    display: "1 nm",
    title: "Viruses, DNA width, proteins",
    fact: "B-DNA is 2 nm wide. Many globular proteins are 3–10 nm. Influenza virions are ~100 nm.",
    objects: ["virus", "dna", "protein"],
    note: "Molecular cartoons. Bond lengths and envelopes are simplified.",
  },
  {
    id: "atomic",
    label: "Atomic scale",
    meters: 1e-10,
    display: "~1 Å",
    title: "Atoms and small molecules",
    fact: "An ångström is 0.1 nm. A hydrogen atom’s characteristic size is about 1 Å. Nuclei are ~10⁵ times smaller still.",
    objects: ["atom", "molecule", "electron"],
    note: "Orbitals are probability clouds, drawn as rings for teaching — not planetary orbits.",
  },
];

export const COMPARE = [
  { id: "hair", name: "Human hair", meters: 8e-5, note: "~80 µm diameter (typical scalp)" },
  { id: "cell", name: "Human cell", meters: 2e-5, note: "~20 µm typical animal cell" },
  { id: "bacteria", name: "Bacterium", meters: 2e-6, note: "~2 µm E. coli length" },
  { id: "virus-c", name: "Virus", meters: 1e-7, note: "~100 nm enveloped virion" },
  { id: "molecule-c", name: "Molecule", meters: 3e-10, note: "~0.3 nm small molecule" },
  { id: "atom-c", name: "Atom", meters: 1e-10, note: "~0.1 nm hydrogen-scale" },
];

export function getObject(id) {
  return OBJECTS.find((o) => o.id === id);
}

export function getZone(id) {
  return ZONES.find((z) => z.id === id);
}

export function searchCatalog(q) {
  const s = q.trim().toLowerCase();
  if (!s) return [];
  return OBJECTS.filter((o) => {
    const blob = [o.name, o.subtitle, o.description, o.structure, ...(o.facts || []), o.zone]
      .join(" ")
      .toLowerCase();
    return blob.includes(s);
  });
}
