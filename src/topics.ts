import { MasterclassTopic } from "./types.js";

export const MASTERCLASS_TOPICS: MasterclassTopic[] = [
  {
    id: "gemini-cli-essentials",
    title: "Gemini CLI Essentials",
    hindiTitle: "जेमिनी सीएलआई एसेंशियल्स",
    category: "AI Tools",
    description: "Mastering terminal-based agentic workflows, including project context parsing, CLI commands, and token budgets.",
    hindiDescription: "टर्मिनल-आधारित एजेंटिक वर्कफ़्लो को नियंत्रित करना, प्रोजेक्ट संदर्भ पार्सिंग और टोकन बजट का प्रबंधन।",
    subtopics: ["Terminal Agentic Interface", "@google/gemini-cli", "Context Window (2M+ tokens)", "Spend Controls & /stats"],
    systemContext: "This topic covers Gemini CLI, an open-source terminal partner rendering REPL interfaces with agentic controls to directly execute workspace actions (filesystem reads, shell tasks, Google Search). It explains the 2M+ token limit of Gemini Pro models, allow-listing of paths, memory management using /memory command, and cost statistics trackable with /stats."
  },
  {
    id: "claude-code-masterclass",
    title: "Claude Code Masterclass",
    hindiTitle: "क्लॉड कोड मास्टरक्लास",
    category: "AI Tools",
    description: "Deep dive into Anthropic's terminal agent, command controls like /compact, /fork, and self-healing loops.",
    hindiDescription: "क्लॉड कोड टर्मिनल एजेंट पर गहन विश्लेषण, निष्पादन मैकेनिज्म, स्व-सुधार प्रक्रिया और कमान कंट्रोल्स।",
    subtopics: ["Terminal-Native Agent", "Interactive Rollback & /rewind", "/compact for token pruning", "Secure Docker Sandbox"],
    systemContext: "This topic details 'Claude Code', a terminal-native agent running directly in developer shells to explore folders, patch code, run regression tests, and fix runtime errors in a self-healing loop. Key commands discussed: /compact to trim token history, /fork to experiment in split branches, /rewind to revert state to safe Milestones, and sandbox isolation via Docker or local secure boundaries."
  },
  {
    id: "nvidia-ai-infrastructure",
    title: "NVIDIA AI Infrastructure & Operations",
    hindiTitle: "एनवीडिया एआई इंफ्रास्ट्रक्चर और ऑपरेशंस",
    category: "AI Infrastructure",
    description: "NCA-AIO certification track covering GPU architectures, CUDA execution grids, memory spaces, and nvidia-smi.",
    hindiDescription: "GPU आर्किटेक्चर, CUDA थ्रेड ग्रिड, मेमोरी हाइरार्की और एनवीडिया-एसएमआई डायग्नोस्टिक्स का अध्ययन।",
    subtopics: ["GPU Streaming Multiprocessors (SM)", "CUDA Blocks & Warps (32 threads)", "HBM3 Memory Bandwidth", "Multi-Instance GPU (MIG) Partition"],
    systemContext: "This topic prep for NVIDIA AIO certification. It focuses on GPU hardware (GPCs, TPCs, SMs with Tensor & CUDA cores). Concepts include CUDA threads grouped into Blocks (up to 1024 threads) and Warps (32 threads scheduled in lockstep lock). It contrasts CPU latency-focused cache hierarchies with GPU throughput-focused HBM3 memory. Covers Multi-Instance GPU (MIG) hardware partitioning (up to 7 instances), nvcc compiler, and diagnostic monitoring using 'nvidia-smi'."
  },
  {
    id: "full-ai-prompting",
    title: "Full AI Prompting Masterclass",
    hindiTitle: "पूर्ण एआई प्रॉम्प्टिंग मास्टरक्लास",
    category: "Prompt Engineering",
    description: "Transitioning from simple keyword search to systematic context injection, evaluation rubrics, and thinking runs.",
    hindiDescription: "नौसिखिया प्रॉम्प्ट्स से पावर-यूज़र बनने की यात्रा, मूल्यांकन रूब्रिक्स और सिस्टेमैटिक संदर्भ प्रॉम्प्टिंग।",
    subtopics: ["Novice vs Power User Mentality", "Sycophancy Mitigation", "Evaluation Rubrics (Score >= 8)", "Outline First Structure"],
    systemContext: "This topic teaches advanced prompt engineering. It contrasts novices (google-style queries, instant gratification expectations) with Power Users (structured systemic profiles, deconstructing tasks). Outlines critical issues of LLM sycophancy (AI output pleasing users instead of factual truth) and teaches how to write objective/neutral prompts. Instructs using evaluation rubrics (scoring response out of 10) and the 'Outline First' long-form writing strategy."
  },
  {
    id: "pipeline-parallelism",
    title: "Pipeline Parallelism in LLM Training",
    hindiTitle: "एलएलएम ट्रेनिंग में पाइपलाइन पैरेललिज्म",
    category: "Distributed Training",
    description: "FSDP, Model Partitioning, GPipe scheduling, 1F1B optimization, and DeepSeek's DualPipe overlapping FWD/BWD.",
    hindiDescription: "एलएलएम मॉडल्स को मल्टिपल जीपीयूस पर ट्रेन करना, जी-पाइप बबल्स और 1F1B मेमोरी शेड्यूलिंग का विवरण।",
    subtopics: ["The Model Parallelism Wall", "Naive Partitioning vs. GPipe Bubbles", "1F1B Scheduling (Memory Stability)", "DualPipe (Overlapping FWD & BWD)"],
    systemContext: "This topic covers training massive LLMs across multiple GPUs. If a model exceeds one GPU's VRAM (e.g. 175B model requires ~700GB+ VRAM, whereas H100 has 80GB), we must shard weights. Discusses Pipeline Parallelism (splitting layers sequentially), GPipe micro-batching to reduce the idle 'bubble' time, 1F1B scheduling (One-Forward-One-Backward) to release activation memory faster, and DeepSeek's DualPipe which overlaps FWD and BWD stages completely."
  },
  {
    id: "production-rag",
    title: "Production RAG with LangChain",
    hindiTitle: "उत्पादन राग (RAG) और लेंगचेन",
    category: "AI Architectures",
    description: "Retrieval-Augmented Generation, document splitting, embeddings, ChromaDB, and hybrid search (BM25 + Dense).",
    hindiDescription: "डॉक्यूमेंट पार्सिंग, एम्बेडिंग मॉडल्स, क्रोमाडीबी, और हाइब्रिड सर्च (BM25 + डेंस) रणनीतियाँ।",
    subtopics: ["RAG Data Ingestion (Parse, Split, Embed)", "ChromaDB and Similarity Metrics", "5 Major Failure Modes", "Advanced RAG (Reranking & GraphRAG)"],
    systemContext: "This topic breaks down Retrieval-Augmented Generation (RAG) with LangChain and Vector Databases. Covers the ingestion pipeline: Standard document loaders (PyPDFLoader, TextLoader), Recursive Text Splitting, dense Embedding models, and ChromaDB indexing. Notes the five major RAG failure modes (bad chunking, poor embeddings, token caps, irrelevant retrieval, unverified output) and advanced solutions: hybrid search (BM25 + Dense), cross-encoder reranking, Contextual Retrieval, and GraphRAG."
  },
  {
    id: "massively-parallel",
    title: "Secrets of Massively Parallel Training",
    hindiTitle: "मैसिवली पैरेलल ट्रेनिंग के रहस्य",
    category: "Distributed Training",
    description: "DeepSpeed, ZeRO optimizations, model parameter sharding, Mixture of Experts (MoE), and activation checkpointing.",
    hindiDescription: "डीपस्पीड, ज़ीरो ऑप्टिमाइज़र, एक्टीवेशन चेकपॉइंटिंग और मिक्सचर ऑफ एक्सपर्ट्स (MoE) का अध्ययन।",
    subtopics: ["GPU Memory Breakdown (Params, Grads, Opt states)", "ZeRO 1, 2, 3 Partitioning", "Activation Checkpointing (70% memory save)", "Sparse Mixture of Experts (MoE)"],
    systemContext: "This topic analyzes the memory constraints of deep learning. A 7B parameters model trained in mixed precision requires 112GB bytes of VRAM. It details DeepSpeed's ZeRO (Zero Redundancy Optimizer) stages: ZeRO-1 shards optimizer states (4x memory reduction), ZeRO-2 shards gradients (8x), and ZeRO-3 shards parameters. Teaches Activation Checkpointing (recomputing on-the-fly to save 70%+ memory at +33% compute footprint) and Sparse MoE architectures where routers activate expert subsets."
  },
  {
    id: "computer-vision",
    title: "Computer Vision AI vs Human Eyes",
    hindiTitle: "कंप्यूटर विज़न एआई बनाम मानव आँखें",
    category: "Computer Vision",
    description: "Comparative study of biological vision vs digital capture, retina cones/rods vs CMOS, backpropagation vs synaptic loops.",
    hindiDescription: "जैविक दृष्टि बनाम डिजिटल कैमरा, रेटिना कोन्स/रॉड्स बनाम सीएमओएस सेंसर और तंत्रिका नेटवर्क का तुलनात्मक विश्लेषण।",
    subtopics: ["Cones/Rods vs CMOS Bayer Filters", "Visual Cortex (V1 to V6) vs ConvLayers", "Binocular Disparity vs Active LiDAR", "Adversarial Noise & Dataset Bias"],
    systemContext: "This topic compares biological and machine vision. Human eyes use light waveforms and 120M rods (motion, low light) plus cones (color, trichromatic peaks), while cameras use discrete RGB matrix arrays and CMOS sensors with Bayer Filters. It maps hierarchical visual cortex processing (V1-V6 parsing orientation/edges to complex objects) to CNN convolutional/max-pooling layers. It reviews human depth binocular disparity vs LiDAR/active sensors, and limitations (ocular blind spots vs adversarial hacks and dataset biases)."
  },
  {
    id: "agentic-era",
    title: "Google I/O 2026: The Agentic Era",
    hindiTitle: "गूगल आई/ओ 2026: एजेंटिक युग",
    category: "Industry Trends",
    description: "Deconstructed Keynotes covering Gemini 3.5 Flash, Android XR, Astra environmental intelligence, and TPU v8.",
    hindiDescription: "जेमिनी 3.5 फ़्लैश, एंड्रॉइड एक्सआर, प्रोजेक्ट एस्ट्रा और टीपीयू v8 के आधार पर एजेंटिक कंप्यूटिंग का उद्भव।",
    subtopics: ["Sundar Pichai Keynote & Delegated Workflows", "Gemini 3.5 Flash & Thinking Params", "Project Astra (Real-time Video/Audio Mind)", "TPU v8 (8t Training / 8i Inference)"],
    systemContext: "This topic focuses on Google I/O 2026 Keynote highlighting the 'Agentic Gemini Era.' Sundar Pichai announces delegated task workflows (scheduling, active procurements) running autonomously. Co-presents Gemini 3.5 Flash optimized for speed, Project Astra (environmental visual glasses mapping space), Android XR, Chrome as an agentic sandbox, and next-gen TPU v8 (8t training processor vs 8i inference processor)."
  },
  {
    id: "chitti-vs-optimus",
    title: "Chitti vs. Optimus: Robotics",
    hindiTitle: "चित्ती बनाम ऑप्टिमस: रोबोटिक्स",
    category: "Robotics",
    description: "Fiction vs Reality in Humanoid Robotics. Comparative analysis of superintelligence expectations vs current engineering limits.",
    hindiDescription: "ह्यूमनॉइड रोबोटिक्स में कल्पना बनाम वास्तविकता। चित्ती (Enthiran) और टेस्ला रोबोट की तुलना।",
    subtopics: ["Robo Chitti (Enthiran) Fictional Specs", "Tesla Optimus Gen 2 Real-world Tech", "AGI with Neural Schema vs ANI (Spatial tasking)", "Actuators & DURABILITY (Titanium alloy vs Structural polymers)"],
    systemContext: "This topic compares fictional robot Chitti (played by Rajinikanth in the movie Enthiran, spec'd with 1 Terahertz processor, 1GB/s memory, neural schema for emotions, indestructible titanium alloy, run faster than trains) with Tesla Optimus Gen 2 (real-world general purpose robot, built for mass production, uses Artificial Narrow Intelligence (ANI) with 8-camera Vision-Only FSD tech, tactile sensing fingertips for delicate objects, 2.3 kWh battery pack, structural polymers for walking)."
  },
  {
    id: "human-brain-to-robots",
    title: "How to Connect Human Brain to Robots",
    hindiTitle: "मानव मस्तिष्क को रोबोट से कैसे जोड़ें?",
    category: "Neuroscience",
    description: "Brain-Controlled Robotics Roadmap detailing motor cortex, non-invasive EEG signals, signal filtering, and real-time ROS2 mapping.",
    hindiDescription: "मस्तिष्क-नियंत्रित रोबोटिक्स रोडमैप। ईईजी डेटा सिग्नल्स, सिग्नल फ़िल्टरिंग और रीयल-टाइम रोबोटिक एक्टिवेशन।",
    subtopics: ["The Motor Cortex (Planning Voluntary Motion)", "Invasive vs Non-Invasive BCI (Scalp EEG)", "Signal Processing (FFT, ICA, PCA)", "Thought translation latency (<20ms gold standard)"],
    systemContext: "This topic lays a technical roadmap for connectomes. Brain signals originate as electrical impulses (action potentials) in the motor cortex. Brain-Computer Interfaces (BCI) can be Invasive (implants directly in gray matter for high fidelity) or Non-Invansive (wearable scalp dry-electrode EEG). Raw signals are processed via Band-pass filters (0.5Hz - 50Hz) and algorithms like Fast Fourier Transform (FFT), Independent Component Analysis (ICA) for blink removal, then mapped to robotic coordinates in C++ (ROS2) with <20ms real-time latency."
  },
  {
    id: "ai-brain-tumor-detection",
    title: "AI Brain Tumor Detection",
    hindiTitle: "एआई ब्रेन ट्यूमर डिटेक्शन",
    category: "Healthcare",
    description: "Deep learning and computer vision in medical imaging. Highlights MRI modalities (T1, T2, FLAIR) and U-Net segmentations.",
    hindiDescription: "मेडिकल इमेजिंग में एआई। एमआरआई मोडलिटीज़ (T1, T2, FLAIR) और यू-नेट (U-Net) मॉडल सेगमेंटेशन का अध्ययन।",
    subtopics: ["T1-weighted vs T2-weighted vs FLAIR", "U-Net Contracting/Expansive Path & Skip Connections", "Dice Loss Coefficient Cost Function", "Explainable AI (Grad-CAM Activation maps)"],
    systemContext: "This medical AI topic focuses on scanning brain tumors in MRI segments: T1w (anatomy, dark CSF), T2w (fluids, bright CSF), and FLAIR (Fluid Attenuated Inversion Recovery, suppressing CSF signals so tumor margins pop). It teaches the U-Net architecture featuring a symmetric contracting path (encoder) and expansive path (decoder) stitched with skip connections, using the Dice Loss Coefficient to handle class imbalance. For transparency, it uses Explainable AI (Grad-CAM heatmaps showing exact activation regions)."
  },
  {
    id: "how-chatgpt-built",
    title: "How ChatGPT Is Built",
    hindiTitle: "चैटजीपीटी कैसे बनता है",
    category: "AI Architectures",
    description: "Decoding tokenization (BPE), Transformer decoder architectures, Supervised Fine-Tuning, and RLHF alignment.",
    hindiDescription: "BPE टोकननाइजेशन, ट्रांसफ़ॉर्मर डिकोडर, सुपरवाइज्ड फाइन-ट्यूनिंग और आरएलएचएफ (RLHF) अलाइनमेंट।",
    subtopics: ["Byte Pair Encoding (BPE)", "Self-Attention (Q, K, V) & Positional Encoding", "Supervised Fine-Tuning & PPO Optimization", "Safety Alignment Red-Teaming"],
    systemContext: "This topic traces ChatGPT's core architecture. Preprocessing begins with Byte Pair Encoding (BPE) sub-word tokenization and Positional Encoding. Next, the Transformer Decoder layer parses sequences via self-attention with Query, Key, and Value vectors. Training involves three steps: 1) Pre-training (Next token prediction), 2) Supervised Fine-Tuning (SFT) on high-quality human demonstration data, and 3) Reinforcement Learning from Human Feedback (RLHF) aligning help/honesty/harmlessness via Proximal Policy Optimization (PPO)."
  },
  {
    id: "openai-future",
    title: "OpenAI: Building the Future",
    hindiTitle: "ओपनएआई: भविष्य का निर्माण",
    category: "Industry Trends",
    description: "Historical milestones, capped-profit business transition, Microsoft partnership, and safety alignment procedures.",
    hindiDescription: "ओपनएआई का इतिहास, गैर-लाभकारी से 'कैप्ड-प्रॉफिट' संक्रमण और माइक्रोसॉफ्ट साझेदारी का विवरण।",
    subtopics: ["Founding (2015) Non-profit Core", "Capped-Profit Transition (2019)", "$13B Microsoft Azure Alliance", "AGI Safety Alignment Red-Teaming"],
    systemContext: "This topic traces the history and milestones of OpenAI, founded in Dec 2015 as a non-profit to prevent AGI from becoming a weapon. In 2019, transitioned to a 'Capped-Profit' structure (OpenAI LP) to scale massive capital for supercomputers. Details the $13B+ Microsoft partnership utilizing Azure, early projects (Gym, Universe, OpenAI Five in Dota 2), and OpenAI's current alignment/Red-Teaming policy."
  },
  {
    id: "alphafold-code-of-life",
    title: "AlphaFold: The Code of Life",
    hindiTitle: "अल्फ़ाफ़ोल्ड: जीवन का कोड",
    category: "Healthcare",
    description: "Solving the 50-year protein folding biology challenge with Deep learning, attention, and the pLDDT score.",
    hindiDescription: "बायोलॉजी में ५० साल पुरानी प्रोटीन फोल्डिंग समस्या का अल्फ़ाफ़ोल्ड (AlphaFold) के माध्यम से समाधान।",
    subtopics: ["The Protein Folding Problem (Levinthal's Paradox)", "Traditional Cryo-EM and Crystallography Limits", "AlphaFold 2 CASP Breakthrough (92.4 GDT)", "pLDDT Confidence Output Scoring"],
    systemContext: "This topic traces Google DeepMind's AlphaFold. Levinthal's Paradox denotes that a protein sequence can fold into 10^300 possible shapes. Traditional wet-lab methods take years and cost $120,000+. AlphaFold 2 solved this at CASP, reaching 92.4 GDT. SNNs or attention mechanisms treat protein sequences like text sentences and 3D structure like semantic meaning. Outputs are scored with pLDDT (dark blue: atomic confidence, orange: low confidence). Highlighted AlphaFold 3 extends this to DNA/RNA/ligands."
  },
  {
    id: "meta-tribe-v2",
    title: "Meta Tribe v2: The Virtual Brain",
    hindiTitle: "मेटा ट्राइब v2: वर्चुअल ब्रेन",
    category: "Neuroscience",
    description: "Simulating biological brain response to visual/auditory media stimuli, predicting fMRI voxels, and arousal peaks.",
    hindiDescription: "मल्टीमीडिया सिग्नल्स के प्रति जैविक मस्तिष्क की प्रतिक्रिया का अनुकरण (fMRI वोक्सेल्स प्रेडिक्शन)।",
    subtopics: ["The 'In Silico' Brain Simulation", "Perception Engine (Visual Saccadic Transient Mapping)", "fMRI Voxel Prediction (92% Accuracy)", "Brain response as an optimization problem (dopamine/cortisol)"],
    systemContext: "This topic details 'Meta Tribe v2', an AI framework simulating biological brain responses to external multimedia stimuli in silico. It uses a perception transformer engine to parse 4K visual transients (screencuts, saccadic focus) and auditory Dolby Atmos signals, mapping them to predict fMRI voxels and amygdala (arousal/ cortisol/ dopamine spikes) with 92% accuracy, bypassing slow/expensive human lab testing. Outlines severe ethical risks such as hyper-addictive content engineering."
  },
  {
    id: "agi-atlas",
    title: "Artificial General Intelligence (AGI)",
    hindiTitle: "कृत्रिम सामान्य बुद्धिमत्ता (AGI)",
    category: "AI Theory",
    description: "Universal cross-domain learning. Covers cognitive architectures (SOAR, ACT-R), neuro-symbolic hybrids, and Singularity.",
    hindiDescription: "क्रॉस-डोमेन लर्निंग। संज्ञानात्मक आर्किटेक्चर (SOAR, ACT-R), न्यूरो-सिम्बॉलिक सिस्टम और सिंगुलैरिटी।",
    subtopics: ["Definition: Universal, Adaptive, Autonomous", "Cognitive Architectures (SOAR, ACT-R, OpenCog)", "Neuro-Symbolic & System 1 / System 2 hybrids", "The Singularity Horizon and Control Problem"],
    systemContext: "This topic covers Artificial General Intelligence (AGI), defined by universal learning across all domains. Reviews classic cognitive architectures (SOAR, ACT-R, OpenCog) and the shift to modern hybrid systems (Neuro-symbolic combining neural intuition and symbolic logic, and System-1/System-2 dual process). Examines critical obstacles (energy efficiency, sample efficiency, catastrophic forgetting) and the ultimate Singularity control problem."
  },
  {
    id: "ai-genetic-engineering",
    title: "AI x Genetic Engineering",
    hindiTitle: "एआई और जेनेटिक इंजीनियरिंग",
    category: "Healthcare",
    description: "DNA as digital living OS, mining the dark genome, off-target CRISPR predictions, and base editing simulations.",
    hindiDescription: "डीएनए को डिजिटल लिविंग ऑपरेटिंग सिस्टम के रूप में कोडिंग करना और सटीक क्रिस्पर (CRISPR) डिज़ाइन।",
    subtopics: ["Genomics syntactic units (A, T, C, G code)", "The 98% 'Dark Genome' (Switch controls)", "AI-guided guide-RNA CRISPR target design", "In Silico cellular digital twins / base editing"],
    systemContext: "This topic explains molecular engineering. DNA behaves as a 4-bit biological code (ATCG). AI is used to mine the 'Dark Genome' containing non-coding switch structures that regulate expression. AI is deployed as a navigator for CRISPR gene editing, predicting where guide RNA binds to avoid off-target mutations, reducing error by 95%. Enables simulating genetic edits on in silico cellular 'digital twins' before performing wet-lab assays."
  },
  {
    id: "devops-fundamentals",
    title: "DevOps Fundamentals",
    hindiTitle: "डेवऑप्स फंडामेंटल्स",
    category: "Software Engineering",
    description: "Collaboration culture, automated CI/CD pipelines, containerization vs VMs, APM metrics, and monitoring setups.",
    hindiDescription: "डेवलपमेंट और ऑपरेशंस सहयोग, स्वचालित सीआई/सीडी पाइपलाइन्स, कंटेनर बनाम वीएम, और एपीएम लॉग्स।",
    subtopics: ["Continuous Integration & Delivery (CI/CD)", "Virtual Machines vs. Containers (Docker)", "Log Aggregation & Production Monitoring", "Infrastructure as Code (IaC) Consistency"],
    systemContext: "This topic outlines DevOps principles combining development (Dev) and IT operations (Ops). Covers automated CI/CD pipelines compiling and testing code on every commit. Compares VMs (heavy weight guest OS) with Containers (lightweight Docker sharing host kernel). Explains Application Performance Management (APM) with central log aggregation, Prometheus monitoring, and Infrastructure as Code (IaC) to prevent system configuration drift."
  },
  {
    id: "spiking-neural-networks",
    title: "Spiking Neural Networks (SNNs)",
    hindiTitle: "स्पाइकिंग न्यूरल नेटवर्क (SNNs)",
    category: "AI Theory",
    description: "The third generation of neural nets. Explores membrane potential dynamics, event-driven computing, and neuromorphic chips.",
    hindiDescription: "न्यूरल नेटवर्क की तीसरी पीढ़ी। मेम्ब्रेन पोटेंशियल, इवेंट-ड्रिवेन कम्प्यूटेशन और न्यूरोमॉर्फिक हार्डवेयर।",
    subtopics: ["Membrane Potential Threshold", "Event-Driven Spark Complexity", "Training non-differentiability (Surrogate Gradients)", "Neuromorphic Chips (Loihi, TrueNorth)"],
    systemContext: "This topic explores Spiking Neural Networks (SNNs), the third generation of neural nets. Unlike traditional ANNs utilizing continuous activations, SNNs communicate through discrete binary spikes only when membrane potential crosses a critical threshold. This event-driven approach ensures massive energy efficiency. Explains training challenges due to non-differential spikes (solved via surrogate gradients or STDP) and neuromorphic chips (Intel Loihi, IBM TrueNorth)."
  }
];
