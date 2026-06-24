import type { LocalizedGameContent } from "@/games/content-types";

export const countContent: LocalizedGameContent = {
  en: {
    intro:
      "Count trains your Approximate Number Sense by flashing a field of dots just long enough to force estimation — then scoring how close your gut feeling really was.",

    metaTitle: "Count — Numerosity Estimation | Senso Games",

    metaDescription:
      "Flash dot fields, estimate quantities from 8 to 40, and measure your number acuity. Count by Senso isolates the Approximate Number Sense with scientifically controlled stimuli.",

    keywords: [
      "approximate number sense",
      "numerosity estimation",
      "dot estimation game",
      "number acuity",
      "ANS training",
      "Senso games",
      "subitizing",
      "Weber fraction",
      "perceptual precision",
      "cognitive training",
    ],

    whatItIs: [
      "Count is a numerosity estimation game in the Senso collection of perceptual precision games. On each trial a field of dots appears on screen for about 1.4 seconds, then disappears behind a visual mask. Your task is to type how many dots you think were there. For larger arrays the mask cuts you off before a careful tally is possible, so you lean on your intuitive sense of quantity.",
      "The dot count ranges from 8 to 40 dots. What makes Count scientifically rigorous is how those dots are drawn: trials alternate between a constant-total-area layout and a constant-dot-size layout. This decorrelates the total inked area, the average dot density, and the number of dots from one another, so the only reliable cue to 'how many' is number itself. You cannot cheat by judging 'how much stuff is on screen' — you have to estimate numerosity directly.",
    ],

    howToPlay: [
      "Each session consists of five rounds. A fixation cue appears, then the dot field shows for about 1.4 seconds, then the mask replaces it. Type your estimate in the input box and confirm. You receive immediate feedback showing the actual count alongside your guess and the points earned for that round. After five rounds your total score out of 50 is displayed.",
      "There is no time pressure once the mask appears — take a moment to anchor your impression before typing. Resist the urge to hedge towards round numbers; your first gut feeling tends to be more accurate than a second-guessed compromise. The difficulty is calibrated so that even practised estimators have room to improve.",
    ],

    science: [
      "The ability to rapidly judge 'how many' without counting is called the Approximate Number Sense (ANS). It is one of the oldest cognitive faculties studied in numerical cognition research: infants a few days old can discriminate arrays that differ in number, and the same capacity has been documented in fish, birds, monkeys, and many other species. The ANS is a nonverbal, pre-symbolic system that operates in parallel with the language-based number system humans learn in childhood.",
      "The ANS obeys Weber's law: the ease of distinguishing two quantities depends on their ratio, not their absolute difference. Telling apart 10 dots from 20 dots is roughly as easy as telling apart 40 dots from 80 dots, because both pairs share the same 1:2 ratio. Each individual has a characteristic Weber fraction — a measure of their number acuity — that describes how large a ratio difference they need before they reliably notice it. A lower Weber fraction means sharper numerosity perception. Count's scoring metric is built directly on this principle: your error is measured as the absolute log-base-2 ratio of your guess to the actual count, so an overestimate and an underestimate of the same ratio magnitude cost the same number of points.",
      "The intraparietal sulcus (IPS), a region of posterior parietal cortex, is strongly and consistently implicated in numerosity processing across neuroimaging studies. Patients with damage to parietal regions often show selective impairments in approximate number judgements while retaining other cognitive abilities. The IPS appears to contain neurons tuned to preferred numerosities, analogous to orientation-selective neurons in visual cortex.",
      "Count also touches on subitizing — the fast, exact, and virtually effortless apprehension of very small quantities (typically 1 to 4 items). When a display contains four or fewer dots, most people report their count with high confidence and near-zero error; reaction times are flat across that range. Above roughly four items, performance shifts to the noisier estimation regime governed by the ANS. Research has shown that ANS acuity measured by tasks like Count correlates with formal mathematical achievement, though the relationship is distinct from general intelligence and is thought to reflect a foundational perceptual substrate that symbolic math builds upon rather than replaces.",
    ],

    scoring: [
      "Each round is worth up to 10 points. Your score for a round is calculated as 10 minus a penalty derived from your log-ratio error: error = |log2(guess / actual)|. You earn exactly half the round's points — 5 out of 10 — when your error reaches 0.17 log2 units, which corresponds to being off by about 12 percent. A perfect guess scores the full 10; an estimate more than roughly 25 percent off in either direction scores progressively less.",
      "Over five rounds the maximum total is 50 points. Because the metric is symmetric in log space, overshooting and undershooting by the same factor are penalised equally. Tracking your score across sessions is a direct window onto your Weber fraction: consistent improvement means your ANS acuity is sharpening, either through genuine perceptual learning or through a reduction in response bias (such as the common tendency to underestimate large dot arrays).",
    ],

    tips: [
      "Look at the whole field at once rather than scanning — your visual system integrates density and spatial extent in parallel, and saccading wastes the limited exposure time.",
      "Anchor to a sub-region first. If you briefly glimpse a cluster of roughly ten dots in one quarter of the screen, scale up based on how the rest of the field compares to that anchor.",
      "Notice your consistent bias. Most people underestimate large arrays and overestimate very sparse ones. If you know you tend to go low, nudge your response upward before submitting.",
      "Do not round to the nearest five or ten. The scoring function penalises ratio errors symmetrically, so precise estimates that happen to be odd numbers are no worse than round ones — but rounded guesses cluster around a narrower range and will sometimes miss by more.",
      "Commit to your first impression. The brief exposure and mask leave little time to tally larger arrays, and post-hoc rationalisation is more likely to pull you away from an accurate initial estimate than to improve it.",
      "Train consistently rather than in long isolated bursts. Perceptual learning in numerosity tasks accumulates across sessions; the neural populations in the intraparietal sulcus that encode numerosity benefit from spaced exposure just as motor skills do.",
    ],

    faq: [
      {
        q: "Why does the dot size change between trials?",
        a: "Dot size is varied deliberately to prevent you from using total inked area as a proxy for number. If all dots were the same size, a larger array would always look 'heavier' or 'denser', and you could judge quantity indirectly by judging visual mass. By alternating between constant-total-area layouts (where more dots means smaller dots) and constant-dot-size layouts (where more dots means a denser field), Count ensures that neither area nor density alone predicts number. You are forced to estimate numerosity itself.",
      },
      {
        q: "What is the Approximate Number Sense and can it be trained?",
        a: "The Approximate Number Sense is an evolutionarily ancient, nonverbal system for estimating quantity without counting. It is present from birth and is shared with many animal species. Research on whether the ANS can be improved through training is ongoing; some studies find genuine improvements in Weber fraction with practice, while others attribute gains to reduced response bias rather than sharper perception. Either outcome benefits your score, and reducing systematic bias is itself a form of cognitive calibration.",
      },
      {
        q: "Why does the game use a log-ratio error metric instead of a simple difference?",
        a: "Weber's law tells us that the subjective difficulty of a numerical judgment scales with the ratio of the quantities involved, not their absolute difference. Being off by 5 when the answer is 10 is a much larger perceptual error than being off by 5 when the answer is 80. The log-ratio metric — |log2(guess / actual)| — captures this ratio-based scale correctly, so your score reflects genuine perceptual precision rather than penalising large-number trials more harshly simply because absolute errors there are bigger.",
      },
      {
        q: "What is the difference between subitizing and estimation?",
        a: "Subitizing is the instant, virtually effortless recognition of exact quantities up to about four items — you see three dots and simply know it is three, with no mental arithmetic required. Estimation, by contrast, is what the ANS does for larger arrays: it produces a fast but approximate magnitude impression whose precision degrades as the ratio between compared quantities shrinks. Count spans both regimes. For the smallest arrays you may subitize correctly; for larger arrays you are squarely in ANS territory. Noticing where your accuracy drops off is itself informative about your subitizing range.",
      },
      {
        q: "Does a high score on Count mean I am good at maths?",
        a: "Not directly. ANS acuity and formal mathematical ability are correlated — studies find that people with sharper approximate number sense tend to perform better on symbolic arithmetic and algebra — but they are distinct capacities. Count measures your perceptual precision for nonsymbolic quantities. Strong performance reflects a well-calibrated intuitive number sense, which researchers believe provides a foundational substrate for learning symbolic mathematics, rather than being the same skill.",
      },
    ],
  },

  pt: {
    intro:
      "O Count treina o teu Sentido Aproximado de Número ao mostrar um campo de pontos durante uma fração de segundo, obrigando-te a estimar — e depois mede o quanto a tua intuição acertou.",

    metaTitle: "Count — Estimativa de Numerosidade | Senso Games",

    metaDescription:
      "Estima campos de pontos entre 8 e 40, mede a tua acuidade numérica e treina o Sentido Aproximado de Número. Count do Senso usa estímulos controlados cientificamente.",

    keywords: [
      "sentido aproximado de número",
      "estimativa de numerosidade",
      "jogo de pontos",
      "acuidade numérica",
      "treino ANS",
      "Senso games",
      "subitização",
      "fração de Weber",
      "precisão percetual",
      "treino cognitivo",
    ],

    whatItIs: [
      "O Count é um jogo de estimativa de numerosidade da coleção Senso de jogos de precisão percetual. Em cada tentativa, um campo de pontos aparece no ecrã durante cerca de 1,4 segundos e depois desaparece atrás de uma máscara visual. A tua tarefa é escrever quantos pontos achas que estavam lá. Em conjuntos maiores, a máscara corta-te antes de uma contagem cuidadosa ser possível, por isso recorres ao teu sentido intuitivo de quantidade.",
      "O número de pontos vai de 8 a 40. O que torna o Count cientificamente rigoroso é a forma como esses pontos são desenhados: as tentativas alternam entre um esquema de área total constante e um esquema de tamanho de ponto constante. Isto descorrelaciona a área total de tinta, a densidade média dos pontos e o número de pontos entre si, de modo a que o único indicador fiável de «quantos» seja mesmo o número. Não consegues fazer batota julgando «quanta coisa há no ecrã» — tens de estimar a numerosidade diretamente.",
    ],

    howToPlay: [
      "Cada sessão tem cinco rondas. Aparece uma pista de fixação, o campo de pontos mostra-se durante cerca de 1,4 segundos, e depois a máscara substitui-o. Escreve a tua estimativa na caixa de entrada e confirma. Recebes feedback imediato a mostrar o número real a par da tua resposta e os pontos ganhos nessa ronda. Após as cinco rondas é apresentada a tua pontuação total em 50.",
      "Não há pressão de tempo depois de a máscara aparecer — tira um momento para ancorar a tua impressão antes de escrever. Resiste à tentação de arredondar para números redondos; a tua primeira intuição tende a ser mais precisa do que um compromisso repensado. A dificuldade está calibrada para que mesmo estimadores experientes tenham margem para melhorar.",
    ],

    science: [
      "A capacidade de julgar rapidamente «quantos» sem contar chama-se Sentido Aproximado de Número (ANS, do inglês Approximate Number Sense). É uma das faculdades cognitivas mais antigas estudadas na investigação sobre cognição numérica: bebés com poucos dias de vida conseguem discriminar conjuntos que diferem em número, e a mesma capacidade foi documentada em peixes, pássaros, macacos e muitas outras espécies. O ANS é um sistema não-verbal e pré-simbólico que opera em paralelo com o sistema numérico baseado em linguagem que os humanos aprendem na infância.",
      "O ANS obedece à Lei de Weber: a facilidade de distinguir duas quantidades depende do seu rácio, não da sua diferença absoluta. Distinguir 10 pontos de 20 pontos é aproximadamente tão fácil como distinguir 40 pontos de 80 pontos, porque ambos os pares partilham o mesmo rácio de 1:2. Cada indivíduo tem uma fração de Weber característica — uma medida da sua acuidade numérica — que descreve a diferença de rácio mínima de que precisam para a notar de forma fiável. Uma fração de Weber mais baixa significa uma perceção de numerosidade mais aguçada. A métrica de pontuação do Count é construída diretamente sobre este princípio: o teu erro é medido como o rácio logarítmico em base 2 (em valor absoluto) da tua estimativa em relação ao número real, de modo a que uma sobrestimativa e uma subestimativa da mesma magnitude de rácio custam o mesmo número de pontos.",
      "O sulco intraparietal (IPS), uma região do córtex parietal posterior, está forte e consistentemente implicado no processamento de numerosidade em estudos de neuroimagem. Pacientes com lesões em regiões parietais mostram frequentemente défices seletivos em julgamentos de número aproximado enquanto mantêm outras capacidades cognitivas. O IPS parece conter neurónios sintonizados para numerosidades preferidas, de forma análoga aos neurónios seletivos para orientação no córtex visual.",
      "O Count toca também na subitização — a apreensão rápida, exata e praticamente sem esforço de quantidades muito pequenas (tipicamente 1 a 4 itens). Quando um ecrã contém quatro ou menos pontos, a maioria das pessoas indica o número com elevada confiança e erro quase nulo; os tempos de resposta são estáveis nesse intervalo. Acima de cerca de quatro itens, o desempenho muda para o regime de estimativa mais impreciso governado pelo ANS. A investigação mostrou que a acuidade do ANS medida por tarefas como o Count se correlaciona com o rendimento matemático formal, embora a relação seja distinta da inteligência geral e se pense que reflete um substrato percetual fundacional sobre o qual a matemática simbólica se constrói, em vez de a substituir.",
    ],

    scoring: [
      "Cada ronda vale até 10 pontos. A tua pontuação numa ronda é calculada como 10 menos uma penalização derivada do teu erro de log-rácio: erro = |log2(estimativa / valor real)|. Ganhas exatamente metade dos pontos da ronda — 5 em 10 — quando o teu erro atinge 0,17 unidades log2, o que corresponde a estar errado em cerca de 12 por cento. Uma estimativa perfeita dá os 10 pontos completos; uma estimativa com mais de cerca de 25 por cento de desvio em qualquer direção pontua progressivamente menos.",
      "Ao longo de cinco rondas o máximo total é 50 pontos. Como a métrica é simétrica no espaço logarítmico, ultrapassar e ficar aquém pelo mesmo fator são penalizados de igual forma. Acompanhar a tua pontuação entre sessões é uma janela direta para a tua fração de Weber: melhorar consistentemente significa que a tua acuidade do ANS está a afiar-se, seja por aprendizagem percetual genuína ou por redução de viés de resposta (como a tendência comum de subestimar grandes conjuntos de pontos).",
    ],

    tips: [
      "Olha para todo o campo de uma vez em vez de fazer varrimentos — o teu sistema visual integra densidade e extensão espacial em paralelo, e os movimentos sacádicos desperdiçam o tempo de exposição limitado.",
      "Ancora-te primeiro a uma sub-região. Se vislumbrares brevemente um agrupamento de cerca de dez pontos num quarto do ecrã, escala para cima com base em como o resto do campo se compara a essa âncora.",
      "Nota o teu viés consistente. A maioria das pessoas subestima grandes conjuntos e sobrestima os muito esparsos. Se sabes que costumas ir para baixo, empurra a tua resposta ligeiramente para cima antes de submeter.",
      "Não arredondares para o cinco ou dez mais próximo. A função de pontuação penaliza os erros de rácio simetricamente, por isso estimativas precisas que acabem por ser números ímpares não são piores do que números redondos — mas as estimativas arredondadas agrupam-se num intervalo mais estreito e por vezes erram por mais.",
      "Compromete-te com a tua primeira impressão. A exposição breve e a máscara deixam pouco tempo para contar conjuntos maiores, e a racionalização posterior é mais provável que te afaste de uma estimativa inicial precisa do que que a melhore.",
      "Treina de forma consistente em vez de em longos blocos isolados. A aprendizagem percetual em tarefas de numerosidade acumula-se ao longo das sessões; as populações neuronais no sulco intraparietal que codificam a numerosidade beneficiam de exposição espaçada tal como as competências motoras.",
    ],

    faq: [
      {
        q: "Porque é que o tamanho dos pontos muda entre tentativas?",
        a: "O tamanho dos pontos é variado deliberadamente para te impedir de usar a área total de tinta como substituto para o número. Se todos os pontos tivessem o mesmo tamanho, um conjunto maior pareceria sempre mais 'pesado' ou 'denso', e poderias julgar a quantidade indiretamente pela massa visual. Ao alternar entre esquemas de área total constante (onde mais pontos significa pontos mais pequenos) e esquemas de tamanho de ponto constante (onde mais pontos significa um campo mais denso), o Count garante que nem a área nem a densidade sozinhas preveem o número. És obrigado a estimar a numerosidade em si.",
      },
      {
        q: "O que é o Sentido Aproximado de Número e pode ser treinado?",
        a: "O Sentido Aproximado de Número é um sistema evolutivamente antigo e não-verbal para estimar quantidades sem contar. Está presente desde o nascimento e é partilhado com muitas espécies animais. A investigação sobre se o ANS pode ser melhorado com treino está em curso; alguns estudos encontram melhorias genuínas na fração de Weber com prática, enquanto outros atribuem os ganhos à redução do viés de resposta em vez de uma perceção mais aguçada. Qualquer dos resultados beneficia a tua pontuação, e reduzir o viés sistemático é em si uma forma de calibração cognitiva.",
      },
      {
        q: "Porque é que o jogo usa uma métrica de erro de log-rácio em vez de uma diferença simples?",
        a: "A Lei de Weber diz-nos que a dificuldade subjetiva de um julgamento numérico escala com o rácio das quantidades envolvidas, não com a sua diferença absoluta. Errar por 5 quando a resposta é 10 é um erro percetual muito maior do que errar por 5 quando a resposta é 80. A métrica de log-rácio — |log2(estimativa / valor real)| — captura corretamente esta escala baseada em rácio, por isso a tua pontuação reflete precisão percetual genuína em vez de penalizar as tentativas de grandes números mais duramente simplesmente porque os erros absolutos aí são maiores.",
      },
      {
        q: "Qual é a diferença entre subitização e estimativa?",
        a: "A subitização é o reconhecimento instantâneo e praticamente sem esforço de quantidades exatas até cerca de quatro itens — vês três pontos e simplesmente sabes que são três, sem necessidade de cálculo mental. A estimativa, por outro lado, é o que o ANS faz para conjuntos maiores: produz uma impressão de magnitude rápida mas aproximada, cuja precisão diminui à medida que o rácio entre quantidades comparadas se aproxima de 1. O Count abrange os dois regimes. Para os conjuntos mais pequenos podes subitizar corretamente; para conjuntos maiores estás claramente no território do ANS. Notar onde a tua precisão começa a cair é em si informativo sobre o teu alcance de subitização.",
      },
      {
        q: "Uma pontuação alta no Count significa que sou bom a matemática?",
        a: "Não diretamente. A acuidade do ANS e a capacidade matemática formal estão correlacionadas — estudos mostram que pessoas com um sentido aproximado de número mais aguçado tendem a ter melhor desempenho em aritmética simbólica e álgebra — mas são capacidades distintas. O Count mede a tua precisão percetual para quantidades não simbólicas. Um bom desempenho reflete um sentido intuitivo de número bem calibrado, que os investigadores acreditam fornecer um substrato fundacional para aprender matemática simbólica, em vez de ser a mesma competência.",
      },
    ],
  },
};
