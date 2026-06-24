import type { LocalizedGameContent } from "@/games/content-types";

export const hueContent: LocalizedGameContent = {
  en: {
    intro:
      "Hue challenges you to memorise a colour from a single fleeting glance and recreate it with three sliders — a deceptively simple test of visual memory and perceptual precision.",
    metaTitle: "Hue – Colour Memory Game | Senso Perceptual Games",
    metaDescription:
      "Test your colour memory in Hue, part of the Senso collection. A target colour flashes for under a second; adjust Hue, Saturation, and Brightness to match it. Scored with CIEDE2000.",
    keywords: [
      "colour memory game",
      "hue saturation brightness",
      "perceptual precision",
      "Senso games",
      "HSV colour picker",
      "CIEDE2000",
      "colour vision test",
      "visual memory",
      "OKLCh colour space",
      "iconic memory",
    ],
    whatItIs: [
      "Hue is a colour-memory challenge in the Senso collection of perceptual precision games. Each round, a single colour floods your screen for less than a second, then disappears. Your task is to recreate that colour as accurately as possible using three sliders: Hue, Saturation, and Brightness — the three axes of the HSV colour model.",
      "The game is deliberately minimal. There are no distractions, no timers ticking on screen, and no partial cues — just the colour, the silence, and your memory. Five rounds make up a full session, giving a maximum score of 50 points. Target colours are bright and well-saturated, generated in OKLCh and displayed in sRGB, giving your perceptual system a clear but brief signal to lock onto.",
      "Colours in Hue are generated in the OKLCh colour space, a perceptually uniform model in which equal numeric steps correspond to equal perceived differences across all hues. They are then gamut-mapped to sRGB for display, ensuring that every target is a colour your screen can render faithfully. Accuracy is measured using the CIEDE2000 colour-difference formula (Delta-E 2000, or Delta-E00), the current gold standard for quantifying how different two colours look to a human observer.",
    ],
    howToPlay: [
      "At the start of each round a colour appears and fills the entire screen. Look at it carefully — it will only be visible for a fraction of a second. Once it disappears you will see three sliders labelled Hue, Saturation, and Brightness. Drag each slider until the preview swatch matches what you remember. Hue controls the colour's position on the colour wheel (red, orange, yellow, green, blue, violet, and back to red). Saturation controls how vivid or washed-out the colour appears. Brightness controls how light or dark it is.",
      "When you are satisfied with your match, confirm your answer to see your score for the round. Your score depends on how close your guess is to the original target colour as measured by CIEDE2000. A difference of Delta-E00 12 earns half marks (5 out of 10); a perfect match scores 10 points, and your running total is shown at the end of all five rounds.",
    ],
    science: [
      "The core challenge in Hue is rooted in the nature of iconic memory — the very first stage of visual processing. When a stimulus disappears, a high-capacity but extremely short-lived sensory trace lingers in your visual system for roughly a few hundred milliseconds. George Sperling's landmark 1960 partial-report experiments were the first to measure iconic memory precisely: by cuing participants to report only a subset of a briefly flashed letter grid, Sperling demonstrated that the initial sensory store holds far more information than people can consciously report, but that it decays almost immediately. In Hue, that brief iconic trace is your best resource — which is why the colour is shown for less than a second rather than several seconds.",
      "The difficulty compounds because colour memory degrades in a characteristic way. Even when the iconic trace fades, people retain a rough categorical sense of the colour — 'it was a muted teal' or 'something orangey-red'. This phenomenon, known as the memory colour effect and closely related to categorical perception of colour, means that recall is pulled toward the prototypical examples of basic colour categories rather than preserved as a precise perceptual value. The sliders in Hue force you to move beyond category-level recall and commit to an exact point in three-dimensional colour space, exposing every degree of imprecision.",
      "Human colour perception rests on three types of cone photoreceptors in the retina — the L (long), M (medium), and S (short) wavelength cones — whose combined responses encode any colour as a point in a three-dimensional space. The Hue slider maps onto the dominant wavelength dimension, Saturation corresponds roughly to the ratio of chromatic to achromatic cone excitation, and Brightness reflects overall cone excitation. Complicating accurate recall is colour constancy: the visual system continuously discounts the spectral composition of the ambient illuminant so that object colours appear stable under different lighting conditions. This adaptive process is helpful in everyday life but makes absolute colour memory unreliable, because your memory of a colour includes assumptions about its lighting context that no longer apply once the stimulus is gone.",
      "Scoring in Hue uses the CIEDE2000 formula, which computes colour difference in the CIE Lab colour space. CIE Lab was designed so that equal numeric distances correspond to equal perceived differences — a property called perceptual uniformity. In practice the 1976 CIE76 formula (simple Euclidean distance in Lab) was found to be insufficiently uniform, particularly for saturated blues and near-neutral colours. CIEDE2000 applies a series of corrections — including separate weighting functions for lightness, chroma, and hue, and a rotation term in the blue region — to bring numeric differences into close alignment with the judgements of trained colour observers. This means a Delta-E00 of, say, 5 represents a reliably similar perceptual gap regardless of whether the colours are pale yellows or vivid cyans. A note on accessibility: Hue is the one game in the Senso collection that depends directly on colour vision. Colour vision deficiency affects approximately 8% of men and 0.5% of women; if you are affected, the other four Senso games do not involve colour discrimination and are fully accessible.",
    ],
    scoring: [
      "Each round is scored on a 0–10 scale based on the CIEDE2000 colour difference between the target colour and your guess. A perfect or near-perfect match scores 10. As the difference grows, the score decreases linearly. The half-score threshold — the difference that earns exactly 5 out of 10 — is Delta-E00 12. Beyond that threshold the score continues to fall toward zero for very large differences.",
      "Across five rounds the maximum total is 50 points. Your cumulative score is displayed after the final round. Because CIEDE2000 is perceptually calibrated, your score is a meaningful measure of how closely your colour memory matches reality: consistent scores above 40 indicate excellent colour recall, scores in the 25–40 range reflect typical human performance, and anything below 20 suggests that categorical memory is dominating over precise perceptual recall.",
    ],
    tips: [
      "Prioritise Hue first — it is the axis where human vision is most sensitive to error and where the largest score losses occur. Get the hue roughly right before fine-tuning Saturation and Brightness.",
      "Try to form a verbal label for the colour the instant it appears ('warm amber', 'cool slate blue') and combine it with a felt sense of its intensity and lightness. The verbal label anchors the categorical information; the felt sense preserves some of the metric detail.",
      "After setting the sliders, glance away from the preview swatch for a moment and then look back. Fresh glances catch colour shifts that continuous staring misses due to chromatic adaptation of your photoreceptors.",
      "Do not neglect the Saturation and Brightness sliders even when you feel confident about the Hue. Memory tends to compress saturation toward the middle and pull brightness toward a remembered average — consciously push your initial estimates toward the extremes and then correct back.",
      "Play in consistent lighting conditions. Ambient light affects how your monitor appears and can shift your perception of both the target and the preview swatch.",
      "If you find your scores plateauing, try the Munsell or NCS student colour-order exercises available in many art and design curricula — regular exposure to ordered colour samples genuinely improves colour discrimination over time.",
    ],
    faq: [
      {
        q: "Why is the colour shown for such a short time?",
        a: "The brief exposure is intentional: it forces you to rely on iconic memory — the raw, pre-categorical sensory trace that lasts only a few hundred milliseconds — rather than on extended observation that would let you form a stable verbal description. The game is testing the quality of that early sensory store before language can anchor the memory.",
      },
      {
        q: "What is CIEDE2000 and why does Hue use it?",
        a: "CIEDE2000 (Delta-E00) is the current international standard formula for computing how different two colours appear to a human observer. It works in the CIE Lab colour space and applies correction factors to the older CIE76 Euclidean distance formula to make equal numeric differences correspond to equal perceived differences across all hues, lightnesses, and saturations. Hue uses it because a perceptually calibrated score is fairer: a green pair that looks equally different to a blue pair will produce the same score penalty, regardless of where those colours sit in colour space.",
      },
      {
        q: "What is OKLCh and why are target colours generated in it?",
        a: "OKLCh is a modern, perceptually uniform polar colour space — its three axes are Lightness, Chroma, and Hue angle — designed so that systematically stepping along any axis produces an evenly perceived change. Target colours are sampled uniformly in OKLCh to ensure that no region of colour space is over- or under-represented, and that the bright, well-saturated targets can be defined by meaningful perceptual boundaries rather than arbitrary numerical thresholds in a non-uniform space.",
      },
      {
        q: "I have a colour vision deficiency. Can I still play Hue?",
        a: "Hue is the one game in the Senso collection that depends directly on colour discrimination, so colour vision deficiency — which affects roughly 8% of men — will significantly impact your scores. The other four Senso games do not involve colour as a cue and are fully accessible regardless of colour vision status. We recommend those games if you are affected.",
      },
      {
        q: "Does practice actually improve colour memory?",
        a: "Yes, within limits. The categorical and verbal anchoring of colour memory can be improved with deliberate practice — exposure to ordered colour systems such as Munsell or NCS, colour-matching exercises, and activities like painting or colour grading all build finer discrimination. The hard ceiling set by your cone photoreceptor density and the fundamental properties of iconic memory cannot be trained away, but most players have significant room to improve their conscious use of the perceptual information that is already available to them.",
      },
    ],
  },
  pt: {
    intro:
      "O Hue desafia-te a memorizar uma cor num único relance fugaz e a recriá-la com três controlos deslizantes — um teste aparentemente simples à memória visual e à precisão percetiva.",
    metaTitle: "Hue – Jogo de Memória de Cores | Senso Jogos Percetivos",
    metaDescription:
      "Testa a tua memória de cores no Hue, parte da coleção Senso. Uma cor alvo aparece por menos de um segundo; ajusta Matiz, Saturação e Brilho para a recriar. Pontuação com CIEDE2000.",
    keywords: [
      "jogo de memória de cores",
      "matiz saturação brilho",
      "precisão percetiva",
      "Senso jogos",
      "seletor de cores HSV",
      "CIEDE2000",
      "teste de visão de cores",
      "memória visual",
      "espaço de cores OKLCh",
      "memória icónica",
    ],
    whatItIs: [
      "O Hue é um desafio de memória de cores integrado na coleção Senso de jogos de precisão percetiva. Em cada ronda, uma única cor preenche o ecrã por menos de um segundo e depois desaparece. A tua tarefa é recriar essa cor com a maior exatidão possível usando três controlos deslizantes: Matiz, Saturação e Brilho — os três eixos do modelo de cores HSV.",
      "O jogo é deliberadamente minimalista. Não há distrações, sem contagens decrescentes visíveis, sem pistas parciais — apenas a cor, o silêncio e a tua memória. Cinco rondas constituem uma sessão completa, com uma pontuação máxima de 50 pontos. As cores alvo são vivas e bem saturadas, geradas em OKLCh e apresentadas em sRGB, dando ao teu sistema percetivo um sinal claro mas breve para fixar.",
      "As cores do Hue são geradas no espaço de cores OKLCh, um modelo perceptualmente uniforme em que passos numéricos iguais correspondem a diferenças percebidas iguais em todos os matizes. São depois mapeadas para o gâmut sRGB para ecrã, garantindo que cada cor alvo é uma cor que o teu monitor consegue reproduzir fielmente. A precisão é medida usando a fórmula de diferença de cores CIEDE2000 (Delta-E 2000, ou Delta-E00), o padrão de referência atual para quantificar a diferença visual entre duas cores para um observador humano.",
    ],
    howToPlay: [
      "No início de cada ronda, uma cor aparece e preenche o ecrã inteiro. Observa-a com atenção — estará visível apenas por uma fração de segundo. Quando desaparecer, verás três controlos deslizantes com os rótulos Matiz, Saturação e Brilho. Arrasta cada controlo até a amostra de pré-visualização corresponder ao que te recordas. O Matiz controla a posição da cor na roda cromática (vermelho, laranja, amarelo, verde, azul, violeta e de volta ao vermelho). A Saturação controla a vivacidade ou o esbatimento da cor. O Brilho controla a sua luminosidade ou escuridão.",
      "Quando estiveres satisfeito com a tua correspondência, confirma a resposta para ver a pontuação da ronda. A tua pontuação depende da proximidade do teu palpite à cor alvo original, medida pelo CIEDE2000. Uma diferença de Delta-E00 de 12 rende metade dos pontos (5 em 10); uma correspondência perfeita vale 10 pontos, e o teu total acumulado é mostrado no final das cinco rondas.",
    ],
    science: [
      "O desafio central do Hue radica na natureza da memória icónica — a primeira fase do processamento visual. Quando um estímulo desaparece, um traço sensorial de grande capacidade mas extremamente breve persiste no sistema visual durante cerca de algumas centenas de milissegundos. As experiências seminais de George Sperling em 1960, usando o método do relatório parcial, foram as primeiras a medir a memória icónica com precisão: ao indicar aos participantes que reportassem apenas um subconjunto de uma grelha de letras apresentada brevemente, Sperling demonstrou que o armazém sensorial inicial contém muito mais informação do que as pessoas conseguem reportar conscientemente, mas que essa informação decai quase imediatamente. No Hue, esse breve traço icónico é o teu melhor recurso — razão pela qual a cor é mostrada por menos de um segundo e não por vários segundos.",
      "A dificuldade agrava-se porque a memória de cores se degrada de uma forma característica. Mesmo quando o traço icónico desaparece, as pessoas retêm um sentido categórico aproximado da cor — 'era um azul-petróleo baço' ou 'algo entre laranja e vermelho'. Este fenómeno, conhecido como efeito de cor de memória e estreitamente relacionado com a perceção categórica das cores, significa que a recordação é atraída para os exemplos prototípicos das categorias básicas de cor, em vez de ser preservada como um valor percetivo preciso. Os controlos deslizantes do Hue forçam-te a ir além da recordação ao nível da categoria e a comprometeres-te com um ponto exato no espaço de cores tridimensional, expondo cada grau de imprecisão.",
      "A perceção humana de cores assenta em três tipos de fotorreceptores cónicos na retina — os cones L (comprimento de onda longo), M (médio) e S (curto) — cujas respostas combinadas codificam qualquer cor como um ponto num espaço tridimensional. O controlo de Matiz mapeia-se no eixo do comprimento de onda dominante, a Saturação corresponde grosseiramente à razão entre excitação cromática e acromática dos cones, e o Brilho reflete a excitação total dos cones. A complicar a recordação precisa está a constância cromática: o sistema visual desconta continuamente a composição espetral do iluminante ambiente para que as cores dos objetos pareçam estáveis sob diferentes condições de iluminação. Este processo adaptativo é útil na vida quotidiana, mas torna a memória absoluta de cores pouco fiável, porque a memória de uma cor inclui pressupostos sobre o contexto de iluminação que deixam de se aplicar quando o estímulo desaparece.",
      "A pontuação no Hue utiliza a fórmula CIEDE2000, que calcula a diferença de cores no espaço de cores CIE Lab. O CIE Lab foi concebido para que distâncias numéricas iguais correspondam a diferenças percebidas iguais — uma propriedade chamada uniformidade percetiva. Na prática, verificou-se que a fórmula CIE76 de 1976 (distância euclidiana simples em Lab) era insuficientemente uniforme, especialmente para azuis saturados e cores próximas do neutro. O CIEDE2000 aplica uma série de correções — incluindo funções de ponderação separadas para luminosidade, croma e matiz, e um termo de rotação na região do azul — para aproximar as diferenças numéricas dos julgamentos de observadores de cores treinados. Isto significa que um Delta-E00 de, por exemplo, 5 representa uma diferença percetiva consistentemente semelhante, independentemente de as cores serem amarelos pálidos ou cianos vivos. Uma nota sobre acessibilidade: o Hue é o único jogo da coleção Senso que depende diretamente da visão de cores. A deficiência de visão de cores afeta cerca de 8% dos homens e 0,5% das mulheres; se fores afetado, os outros quatro jogos Senso não envolvem discriminação de cores e são totalmente acessíveis.",
    ],
    scoring: [
      "Cada ronda é pontuada numa escala de 0 a 10 com base na diferença de cores CIEDE2000 entre a cor alvo e o teu palpite. Uma correspondência perfeita ou quase perfeita vale 10 pontos. À medida que a diferença aumenta, a pontuação diminui linearmente. O limiar de meia pontuação — a diferença que rende exatamente 5 em 10 — é Delta-E00 12. Para além desse limiar, a pontuação continua a cair em direção a zero para diferenças muito grandes.",
      "Ao longo de cinco rondas, o total máximo é 50 pontos. A tua pontuação acumulada é apresentada após a última ronda. Como o CIEDE2000 é calibrado percetivamente, a tua pontuação é uma medida significativa de quão bem a tua memória de cores corresponde à realidade: pontuações consistentes acima de 40 indicam uma excelente memória de cores; pontuações entre 25 e 40 refletem o desempenho humano típico; e valores abaixo de 20 sugerem que a memória categórica está a dominar sobre a recordação percetiva precisa.",
    ],
    tips: [
      "Dá prioridade ao Matiz em primeiro lugar — é o eixo em que a visão humana é mais sensível ao erro e onde ocorrem as maiores perdas de pontuação. Acerta o matiz aproximadamente antes de ajustar a Saturação e o Brilho.",
      "Tenta formar um rótulo verbal para a cor no instante em que aparece ('âmbar quente', 'azul ardósia frio') e combina-o com uma sensação da sua intensidade e luminosidade. O rótulo verbal ancora a informação categórica; a sensação preserva algum detalhe métrico.",
      "Depois de definires os controlos deslizantes, desvia o olhar da amostra de pré-visualização por um momento e depois olha de novo. Um olhar fresco capta desvios de cor que a observação contínua não deteta devido à adaptação cromática dos teus fotorreceptores.",
      "Não descures os controlos de Saturação e Brilho mesmo quando te sentes confiante em relação ao Matiz. A memória tende a comprimir a saturação para o centro e a puxar o brilho para uma média recordada — empurra conscientemente as tuas estimativas iniciais para os extremos e depois corrige gradualmente.",
      "Joga em condições de iluminação consistentes. A luz ambiente afeta a aparência do monitor e pode distorcer a tua perceção tanto da cor alvo como da amostra de pré-visualização.",
      "Se as tuas pontuações estagnarem, experimenta os exercícios de ordem de cores Munsell ou NCS disponíveis em muitos currículos de arte e design — a exposição regular a amostras de cores ordenadas melhora genuinamente a discriminação de cores ao longo do tempo.",
    ],
    faq: [
      {
        q: "Por que é que a cor é mostrada por tão pouco tempo?",
        a: "A exposição breve é intencional: força-te a depender da memória icónica — o traço sensorial bruto, pré-categórico, que dura apenas algumas centenas de milissegundos — em vez de uma observação prolongada que te permitiria formar uma descrição verbal estável. O jogo está a testar a qualidade desse armazém sensorial precoce antes que a linguagem possa ancorar a memória.",
      },
      {
        q: "O que é o CIEDE2000 e por que é que o Hue o usa?",
        a: "O CIEDE2000 (Delta-E00) é a fórmula padrão internacional atual para calcular o quão diferentes duas cores parecem a um observador humano. Funciona no espaço de cores CIE Lab e aplica fatores de correção à fórmula euclidiana CIE76 mais antiga para que diferenças numéricas iguais correspondam a diferenças percebidas iguais em todos os matizes, luminosidades e saturações. O Hue usa-o porque uma pontuação calibrada percetivamente é mais justa: um par de verdes que parece igualmente diferente de um par de azuis produzirá a mesma penalização de pontuação, independentemente de onde essas cores se situem no espaço de cores.",
      },
      {
        q: "O que é o OKLCh e por que é que as cores alvo são geradas nele?",
        a: "O OKLCh é um espaço de cores polar moderno e perceptualmente uniforme — os seus três eixos são Luminosidade, Croma e ângulo de Matiz — concebido para que avançar sistematicamente ao longo de qualquer eixo produza uma mudança percebida uniformemente. As cores alvo são amostradas uniformemente em OKLCh para garantir que nenhuma região do espaço de cores está sobre- ou sub-representada, e que as cores alvo vivas e saturadas são definidas por fronteiras percetivas significativas em vez de limiares numéricos arbitrários num espaço não uniforme.",
      },
      {
        q: "Tenho deficiência de visão de cores. Posso jogar o Hue?",
        a: "O Hue é o único jogo da coleção Senso que depende diretamente da discriminação de cores, pelo que a deficiência de visão de cores — que afeta cerca de 8% dos homens — terá um impacto significativo nas tuas pontuações. Os outros quatro jogos Senso não utilizam a cor como pista e são totalmente acessíveis independentemente do estado da visão de cores. Recomendamos esses jogos se fores afetado.",
      },
      {
        q: "A prática melhora realmente a memória de cores?",
        a: "Sim, dentro de limites. A ancoragem categórica e verbal da memória de cores pode ser melhorada com prática deliberada — exposição a sistemas de cores ordenados como o Munsell ou o NCS, exercícios de correspondência de cores, e atividades como pintura ou correção de cor constroem uma discriminação mais fina. O teto duro definido pela densidade dos teus fotorreceptores cónicos e as propriedades fundamentais da memória icónica não podem ser eliminados com treino, mas a maioria dos jogadores tem uma margem significativa para melhorar o uso consciente da informação percetiva que já está disponível para eles.",
      },
    ],
  },
};
