import type { LocalizedGameContent } from "@/games/content-types";

export const pitchContent: LocalizedGameContent = {
  en: {
    intro:
      "Pitch challenges you to memorize a pure sine tone and reproduce its exact frequency by ear — a precise test of auditory memory and cochlear resolution.",

    metaTitle: "Pitch — Frequency Memory Game | Senso",

    metaDescription:
      "Listen to a pure tone and drag to match its frequency. Senso Pitch trains your auditory memory and pitch perception across five challenging rounds.",

    keywords: [
      "pitch game",
      "frequency memory",
      "auditory training",
      "tone matching",
      "absolute pitch",
      "ERB scale",
      "hearing game",
      "Senso",
      "perceptual precision",
      "cochlear training",
    ],

    whatItIs: [
      "Pitch is a perceptual precision game in the Senso collection that targets one of the most demanding feats in auditory cognition: holding an exact frequency in memory and retrieving it accurately seconds later. Unlike melody or harmony exercises that rely on the relationship between notes, Pitch strips everything back to a single, isolated sine tone and asks you to reproduce it from memory alone.",
      "Each round presents a pure tone — a mathematically simple waveform with no overtones — generated directly by the Web Audio API. Your goal is to drag a slider up or down to sweep a live tone until it matches the one you just heard, then lock in your answer. The game uses headphones for best results because small frequency differences are much harder to detect on speakers. Over five rounds, your score accumulates, and your total reveals just how finely your auditory system can anchor and recall an absolute frequency.",
    ],

    howToPlay: [
      "At the start of each round a pure sine tone plays for approximately one second. Listen carefully — that tone is your target. After playback ends, a draggable control appears. Drag upward to raise the frequency of a live comparison tone and downward to lower it. The live tone plays continuously as you drag, letting you zero in by ear in real time. When you are satisfied that the live tone matches what you heard, release and confirm your answer.",
      "Target frequencies are sampled uniformly in perceptual space between 120 Hz and 1000 Hz. There are five rounds per game and a maximum score of 50 points. Wear headphones, keep the volume at a comfortable but clearly audible level, and give yourself a quiet room — background noise is the enemy of precise pitch memory.",
    ],

    science: [
      "The fleeting persistence of a sound in the mind is handled by echoic memory, the auditory branch of sensory memory. Echoic memory stores a high-fidelity trace of incoming sound for roughly two to four seconds — considerably longer than iconic (visual) memory, which fades in under a second. This extended window was documented through the suffix effect: an irrelevant spoken word appended to a list of items to be recalled disrupts memory for the final items, as if the suffix overwrites the echoic store (Darwin, Turvey, and Crowder, 1972). In Pitch, your task is to read out a specific attribute — frequency — from that decaying echoic trace before it is gone.",
      "The physical structure of the inner ear explains why frequency distances are measured in ERB units rather than plain Hz. The basilar membrane inside the cochlea is tonotopically organized: high frequencies excite hair cells near the base, low frequencies near the apex. This spatial frequency map is not linear in Hz; the membrane allocates roughly equal physical length to each perceptually equal step in pitch. The Equivalent Rectangular Bandwidth (ERB) scale, derived by Glasberg and Moore (1990), models this cochlear frequency resolution by describing the effective bandwidth of each auditory filter. One ERB unit at 500 Hz spans about 80 Hz; one ERB unit at 4000 Hz spans roughly 500 Hz. Measuring your error in ERB units therefore reflects how large your mistake feels to the ear, not how large it looks on a frequency axis.",
      "The game's error metric is the absolute difference between the ERB-rate of your guess and the ERB-rate of the target: |erb(guess) - erb(target)|, where erb(f) = 21.4 * log10(0.00437 * f + 1). An error of zero means a perfect match. At the half-score threshold — the point where you earn 5 out of 10 points for a round — the tolerance is 2.2 ERB units. To put that in concrete terms, 2.2 ERB units near 440 Hz corresponds to roughly a musical third, so the game is substantially more demanding than casual pitch awareness.",
      "It is worth distinguishing absolute pitch from relative pitch. Absolute pitch (sometimes called perfect pitch) is the rare ability — present in roughly one person in ten thousand — to name or produce a musical note without any external reference. Relative pitch, by contrast, is the common skill of judging the interval between two notes. Pitch tests something close to absolute pitch: you must hold a frequency in memory with no reference tone to compare against. Even trained musicians with excellent relative pitch typically find this difficult, because the brain does not normally need to encode raw Hz values. The just-noticeable difference in frequency (the frequency difference limen) can be as small as a fraction of a Hz for trained listeners under ideal conditions, but memory for an absolute frequency over a delay of seconds is far coarser — most people's performance here reflects echoic retention, not fine-grained perceptual acuity.",
    ],

    scoring: [
      "Each of the five rounds is worth up to 10 points, for a maximum total of 50. Your score for a round falls from 10 toward 0 as your ERB error grows. The scoring curve is calibrated so that a perfect match earns a full 10 and an error at the half-score threshold — 2.2 ERB units — earns 5. Errors larger than that threshold continue to score above zero but diminish quickly, rewarding even imperfect attempts over a complete miss.",
      "Scores in the 40–50 range indicate exceptional absolute frequency memory, well above the typical untrained listener. A score of 25–35 is a respectable result for someone without musical training. Scores below 20 suggest that the echoic trace is fading or being disrupted before you can lock in — try eliminating distractions, using headphones, and responding more quickly after the tone ends.",
    ],

    tips: [
      "Use headphones. Small frequency differences that are unmissable on headphones can become inaudible on laptop speakers, especially in the low-frequency range.",
      "Hum the tone silently to yourself immediately after it plays. Subvocalizing a pitch activates motor memory in addition to auditory memory, giving you a second encoding of the target frequency.",
      "Respond quickly. Echoic memory fades within a few seconds; the longer you wait before starting to drag, the more the trace degrades.",
      "Approach the target from below. Start with the slider near its minimum, sweep upward, and stop when the live tone begins to feel uncomfortably high compared to your memory. Then fine-tune downward. Many people find ascending sweeps easier to judge than descending ones.",
      "Pay special attention to the low bass range. The ERB scale compresses this region, so a small drag produces a relatively large perceptual shift — move slowly when the tone sounds very low.",
      "Between rounds, avoid listening to music or other pitched sounds. New tonal input can interfere with your residual memory of the previous target frequency.",
    ],

    faq: [
      {
        q: "Why does the game use a sine wave instead of a real instrument sound?",
        a: "A sine wave is the simplest possible periodic waveform — it has exactly one frequency component and no overtones. Real instrument sounds are complex mixtures of a fundamental frequency and many harmonics, which means you could partly identify them by timbre rather than by pitch alone. By stripping the tone down to a pure sine wave, Pitch ensures that frequency memory is the only thing being tested.",
      },
      {
        q: "I have musical training. Why do I still find this hard?",
        a: "Most musical training develops relative pitch — the ability to recognize intervals between notes — rather than absolute pitch. Identifying an isolated frequency with no reference is a genuinely different skill. Even professional musicians rarely have true absolute pitch, and those who do typically acquired it before age six. This game is hard for almost everyone; scores above 40 are exceptional.",
      },
      {
        q: "Does the ERB scale mean the difficulty is the same across all frequencies?",
        a: "In theory, yes: because the frequency range is sampled uniformly in ERB space and errors are also measured in ERB units, each region of the auditory range contributes equally to your score. In practice, many people find the low-frequency bass range and the upper range above 1000 Hz subjectively harder, likely because everyday listening experience gives less exposure to those extremes as isolated, reference-free tones.",
      },
      {
        q: "My score varies a lot between sessions. Is that normal?",
        a: "Yes. Absolute frequency memory is strongly affected by context: ambient noise, fatigue, and the sounds you have been hearing in the minutes before playing can all shift your internal frequency reference point. Consistent high scores require consistent listening conditions. That variability is part of what makes the game a genuine challenge rather than a pure motor-skill task.",
      },
      {
        q: "Can regular practice improve my score?",
        a: "Yes, with caveats. Short-term, repetition within a session can sharpen your internal anchor for a particular frequency range. Long-term, consistent perceptual training has been shown to improve frequency discrimination and auditory memory retention. However, developing anything approaching true absolute pitch as an adult is extremely rare regardless of training. Most people will see steady improvement in their ability to use echoic memory efficiently rather than a sudden acquisition of perfect pitch.",
      },
    ],
  },

  pt: {
    intro:
      "O Pitch desafia-te a memorizar um tom puro de onda sinusoidal e a reproduzir a sua frequência exata de ouvido — um teste preciso de memória auditiva e resolução coclear.",

    metaTitle: "Pitch — Jogo de Memória de Frequência | Senso",

    metaDescription:
      "Ouve um tom puro e arrasta para reproduzir a sua frequência. O Senso Pitch treina a tua memória auditiva e perceção tonal em cinco rondas desafiantes.",

    keywords: [
      "jogo de pitch",
      "memória de frequência",
      "treino auditivo",
      "correspondência de tons",
      "pitch absoluto",
      "escala ERB",
      "jogo de audição",
      "Senso",
      "precisão percetiva",
      "treino coclear",
    ],

    whatItIs: [
      "O Pitch é um jogo de precisão percetiva da coleção Senso que se centra numa das tarefas mais exigentes da cognição auditiva: manter uma frequência exata na memória e recuperá-la com precisão segundos depois. Ao contrário de exercícios de melodia ou harmonia que assentam na relação entre notas, o Pitch reduz tudo a um único tom sinusoidal isolado e pede-te que o reproduzas apenas com base na memória.",
      "Cada ronda apresenta um tom puro — uma forma de onda matematicamente simples, sem sobretons — gerado diretamente pela Web Audio API. O teu objetivo é arrastar um controlo para cima ou para baixo, varrendo um tom ao vivo até ele corresponder ao que acabaste de ouvir, e depois confirmar a resposta. O jogo é mais eficaz com auscultadores porque pequenas diferenças de frequência são muito mais difíceis de detetar em colunas. Ao longo de cinco rondas, a tua pontuação acumula-se e o total revela com que precisão o teu sistema auditivo consegue ancorar e recordar uma frequência absoluta.",
    ],

    howToPlay: [
      "No início de cada ronda, é reproduzido um tom sinusoidal puro durante aproximadamente um segundo. Ouve com atenção — esse tom é o teu alvo. Depois da reprodução terminar, aparece um controlo arrastável. Arrasta para cima para aumentar a frequência de um tom de comparação ao vivo e para baixo para a diminuir. O tom ao vivo toca continuamente enquanto arrastas, permitindo-te afinar de ouvido em tempo real. Quando estiveres satisfeito com a correspondência ao tom que ouviste, solta e confirma a resposta.",
      "As frequências-alvo são amostradas uniformemente no espaço percetivo entre 120 Hz e 1000 Hz. Há cinco rondas por jogo e uma pontuação máxima de 50 pontos. Usa auscultadores, mantém o volume a um nível confortável mas claramente audível e procura um ambiente silencioso — o ruído de fundo é o inimigo da memória precisa de pitch.",
    ],

    science: [
      "A persistência fugaz de um som na mente é gerida pela memória ecoica, o ramo auditivo da memória sensorial. A memória ecoica armazena um traço de alta fidelidade do som recebido durante cerca de dois a quatro segundos — consideravelmente mais tempo do que a memória icónica (visual), que se desvanece em menos de um segundo. Esta janela prolongada foi documentada através do efeito de sufixo: uma palavra falada irrelevante, acrescentada no final de uma lista de itens a recordar, perturba a memória dos itens finais, como se o sufixo sobrescrevesse o armazenamento ecoico (Darwin, Turvey e Crowder, 1972). No Pitch, a tua tarefa é extrair um atributo específico — a frequência — desse traço ecoico em decadência antes que ele desapareça.",
      "A estrutura física do ouvido interno explica por que razão as distâncias de frequência são medidas em unidades ERB e não em Hz simples. A membrana basilar, no interior da cóclea, está organizada tonotopicamente: as frequências altas excitam células ciliadas perto da base, as frequências baixas perto do ápice. Este mapa espacial de frequências não é linear em Hz; a membrana aloca comprimento físico aproximadamente igual a cada passo percetivamente igual de altura. A escala de Largura de Banda Retangular Equivalente (ERB), derivada por Glasberg e Moore (1990), modela esta resolução de frequência coclear descrevendo a largura de banda efetiva de cada filtro auditivo. Uma unidade ERB a 500 Hz abrange cerca de 80 Hz; uma unidade ERB a 4000 Hz abrange cerca de 500 Hz. Medir o erro em unidades ERB reflete, por isso, o quão grande parece o erro ao ouvido, e não o quão grande aparenta ser num eixo de frequência.",
      "A métrica de erro do jogo é a diferença absoluta entre a taxa ERB da tua resposta e a taxa ERB do alvo: |erb(resposta) - erb(alvo)|, onde erb(f) = 21.4 * log10(0.00437 * f + 1). Um erro de zero significa uma correspondência perfeita. No limiar de meia pontuação — o ponto em que ganhas 5 em 10 pontos numa ronda — a tolerância é de 2,2 unidades ERB. Para contextualizar, 2,2 unidades ERB perto de 440 Hz corresponde aproximadamente a uma terça musical, pelo que o jogo é substancialmente mais exigente do que a consciência casual de altura tonal.",
      "Vale a pena distinguir pitch absoluto de pitch relativo. O pitch absoluto (por vezes chamado ouvido absoluto) é a capacidade rara — presente em cerca de uma em cada dez mil pessoas — de nomear ou produzir uma nota musical sem qualquer referência externa. O pitch relativo, pelo contrário, é a competência comum de julgar o intervalo entre duas notas. O Pitch testa algo próximo do pitch absoluto: tens de guardar uma frequência em memória sem nenhum tom de referência para comparar. Mesmo músicos treinados com excelente pitch relativo geralmente acham isto difícil, porque o cérebro normalmente não precisa de codificar valores brutos de Hz. O limiar diferencial de frequência (a menor diferença de frequência detetável) pode ser tão pequeno como uma fração de Hz para ouvintes treinados em condições ideais, mas a memória para uma frequência absoluta ao longo de um atraso de segundos é muito mais grosseira — o desempenho da maioria das pessoas reflete retenção ecoica, e não acuidade percetiva refinada.",
    ],

    scoring: [
      "Cada uma das cinco rondas vale até 10 pontos, para um total máximo de 50. A tua pontuação por ronda desce de 10 para 0 à medida que o erro ERB aumenta. A curva de pontuação está calibrada de modo a que uma correspondência perfeita valha 10 pontos e um erro no limiar de meia pontuação — 2,2 unidades ERB — valha 5 pontos. Erros maiores do que esse limiar continuam a pontuar acima de zero, mas diminuem rapidamente, recompensando mesmo tentativas imperfeitas em vez de um erro total.",
      "Pontuações entre 40 e 50 indicam uma memória de frequência absoluta excecional, muito acima do ouvinte não treinado típico. Uma pontuação entre 25 e 35 é um resultado respeitável para alguém sem formação musical. Pontuações abaixo de 20 sugerem que o traço ecoico está a desvanecer ou a ser perturbado antes de conseguires confirmar a resposta — tenta eliminar distrações, usa auscultadores e responde mais rapidamente depois do tom terminar.",
    ],

    tips: [
      "Usa auscultadores. Pequenas diferenças de frequência que são inconfundíveis com auscultadores podem tornar-se inaudíveis em colunas de portátil, especialmente nas frequências baixas.",
      "Tarareia o tom em silêncio para ti mesmo imediatamente após ele tocar. Subvocalizar um pitch ativa a memória motora para além da memória auditiva, dando-te uma segunda codificação da frequência-alvo.",
      "Responde depressa. A memória ecoica desvanece-se em poucos segundos; quanto mais tempo esperares antes de começar a arrastar, mais o traço se degrada.",
      "Aborda o alvo a partir de baixo. Começa com o controlo perto do mínimo, varre para cima e para quando o tom ao vivo começar a parecer desconfortavelmente alto em comparação com a tua memória. Depois afina para baixo. Muitas pessoas acham os varrimentos ascendentes mais fáceis de julgar do que os descendentes.",
      "Presta especial atenção ao registo grave. A escala ERB comprime esta região, pelo que um pequeno arrastar produz uma mudança percetiva relativamente grande — move-te devagar quando o tom soa muito baixo.",
      "Entre rondas, evita ouvir música ou outros sons com altura tonal. Nova entrada tonal pode interferir com a tua memória residual da frequência-alvo da ronda anterior.",
    ],

    faq: [
      {
        q: "Por que é que o jogo usa uma onda sinusoidal em vez do som de um instrumento real?",
        a: "Uma onda sinusoidal é a forma de onda periódica mais simples possível — tem exatamente um componente de frequência e nenhum sobreton. Os sons de instrumentos reais são misturas complexas de uma frequência fundamental e muitas harmónicas, o que significa que poderias identificá-los parcialmente pelo timbre e não apenas pela altura. Ao reduzir o tom a uma onda sinusoidal pura, o Pitch garante que a memória de frequência é a única coisa a ser testada.",
      },
      {
        q: "Tenho formação musical. Por que é que ainda acho isto difícil?",
        a: "A maior parte da formação musical desenvolve o pitch relativo — a capacidade de reconhecer intervalos entre notas — e não o pitch absoluto. Identificar uma frequência isolada sem qualquer referência é uma competência genuinamente diferente. Mesmo músicos profissionais raramente têm verdadeiro pitch absoluto, e os que têm normalmente adquiriram-no antes dos seis anos. Este jogo é difícil para quase toda a gente; pontuações acima de 40 são excecionais.",
      },
      {
        q: "A escala ERB significa que a dificuldade é a mesma em todas as frequências?",
        a: "Em teoria, sim: como o intervalo de frequências é amostrado uniformemente no espaço ERB e os erros também são medidos em unidades ERB, cada região do espetro auditivo contribui igualmente para a tua pontuação. Na prática, muitas pessoas acham o registo grave de baixa frequência e o registo acima de 1000 Hz subjetivamente mais difíceis, provavelmente porque a experiência auditiva quotidiana dá menos exposição a esses extremos como tons isolados e sem referência.",
      },
      {
        q: "A minha pontuação varia muito entre sessões. É normal?",
        a: "Sim. A memória de frequência absoluta é fortemente influenciada pelo contexto: ruído ambiente, cansaço e os sons que ouviste nos minutos anteriores ao jogo podem todos deslocar o teu ponto de referência interno de frequência. Pontuações altas consistentes requerem condições de audição consistentes. Essa variabilidade faz parte do que torna o jogo um desafio genuíno e não uma simples tarefa de habilidade motora.",
      },
      {
        q: "A prática regular pode melhorar a minha pontuação?",
        a: "Sim, com ressalvas. A curto prazo, a repetição dentro de uma sessão pode afiar a tua âncora interna para um determinado intervalo de frequências. A longo prazo, o treino percetivo consistente demonstrou melhorar a discriminação de frequências e a retenção da memória auditiva. No entanto, desenvolver algo próximo do verdadeiro pitch absoluto em adulto é extremamente raro independentemente do treino. A maioria das pessoas verá uma melhoria constante na capacidade de usar a memória ecoica de forma eficiente, em vez de uma aquisição súbita de ouvido absoluto.",
      },
    ],
  },
};
