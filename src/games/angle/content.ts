import type { LocalizedGameContent } from "@/games/content-types";

export const angleContent: LocalizedGameContent = {
  en: {
    intro:
      "Angle challenges you to memorise a needle's orientation in a fraction of a second and reproduce it with precision — a direct test of your visual working memory for orientation.",
    metaTitle: "Angle – Orientation Memory Game | Senso",
    metaDescription:
      "Test how accurately you remember an angle after it vanishes. Angle is a perceptual precision game in the Senso collection that measures your orientation memory.",
    keywords: [
      "angle game",
      "orientation memory",
      "visual perception",
      "Senso games",
      "perceptual precision",
      "oblique effect",
      "visual working memory",
      "angle estimation",
    ],
    whatItIs: [
      "Angle is a perceptual precision game in the Senso collection. Each round, a needle radiates from the centre of the screen and points at a target orientation for less than one second before disappearing. Your job is to rotate a second needle to match that hidden angle as closely as possible, then lock in your answer.",
      "Orientations span the full circle from 0 to 359 degrees, where 0 degrees points straight up and the angle increases clockwise — just like a compass bearing. Faint tick marks are always shown around the dial as a reference grid to help you anchor your estimate.",
      "A single session consists of five rounds. Your score on each round is based on how close your reproduced angle is to the target, and the maximum possible total is 50 points. Because the game isolates a single perceptual primitive — orientation — each session is short but surprisingly revealing about the precision of your visual memory.",
    ],
    howToPlay: [
      "At the start of each round a target needle flashes on screen for under a second. Watch it carefully: try to register not just a rough quadrant but the exact slant of the line. As soon as it disappears, a movable needle appears. Drag or tap to rotate it until it matches the angle you just saw, then confirm your answer to advance to the next round.",
      "Use the tick marks as landmarks — counting graduation marks from the nearest cardinal direction can make your estimate more precise. A useful complementary strategy is to map the angle onto a familiar reference: clock-hand positions, compass bearings, or even the slope of a roof all work as mental anchors.",
      "Because the exposure is brief, avoid over-thinking during the flash itself. Let your visual system capture the angle naturally, then reconstruct it deliberately during the response phase. Five rounds go quickly, and your cumulative score reflects the overall precision of your orientation memory rather than any single lucky or unlucky rep.",
    ],
    science: [
      "Orientation is one of the most fundamental features the visual system extracts from a scene. Neurons in the primary visual cortex (V1) are selectively tuned to lines and edges at specific angles; David Hubel and Torsten Wiesel demonstrated this architecture in the 1960s, work that earned them the Nobel Prize in Physiology or Medicine in 1981. These neurons are organised into orientation columns — repeating cortical modules in which neighbouring cells respond to similar orientations — so the brain effectively tiles orientation space with a dedicated neural map.",
      "Despite this rich neural machinery, human orientation perception is not uniform across directions. The oblique effect is a well-replicated phenomenon in which people judge and remember cardinal orientations — horizontal (90 / 270 degrees) and vertical (0 / 180 degrees) — more accurately than oblique or diagonal orientations. Two factors explain this: first, more V1 neurons are tuned to cardinal orientations than to diagonals; second, the statistics of natural scenes are anisotropic, with horizontal and vertical edges far more prevalent than oblique ones, so the visual system has learned to represent cardinals with higher fidelity. You may notice this effect directly while playing Angle — cardinal targets feel easier to remember and reproduce.",
      "When the needle disappears, you enter a retention interval during which visual working memory must hold the orientation. Working memory for low-level visual features such as orientation has limited precision: the internal representation is not a perfect snapshot but a noisy estimate whose uncertainty grows with the length of the delay. Research using continuous-report paradigms similar to Angle has shown that errors are not random; instead, remembered orientations are systematically pulled toward categorical reference frames — the nearest cardinal axis or a learned oblique prototype. This categorical bias can cause you to over-correct toward 0, 90, 180, or 270 degrees even when the true target was several degrees away.",
      "The interplay between early sensory encoding strength and working-memory fidelity means that your score in Angle is a composite measure: how sharply V1 captured the orientation during the brief exposure, and how well your working memory preserved it through the retention interval. Practising the game can sharpen metacognitive awareness of which angles you encode reliably and which tend to drift — an insight that transfers to real-world tasks involving spatial reasoning, technical drawing, and navigation.",
    ],
    scoring: [
      "Your score for each round is determined by the shortest circular distance between your answer and the target — that is, min(|difference|, 360 minus |difference|) — so the game always measures the smallest possible arc between the two needles. A perfect match scores 10 points. The half-score threshold is 14 degrees: if your error equals or exceeds that value your score for that round drops to 5 or below, scaling linearly to zero as the error grows.",
      "Over five rounds the maximum total is 50 points. Because the circular-distance metric is symmetric, there is no directional bias — being 10 degrees clockwise is penalised identically to being 10 degrees counter-clockwise.",
    ],
    tips: [
      "Convert angles to clock positions mentally: 0 degrees is 12 o'clock, 90 degrees is 3 o'clock, 180 degrees is 6 o'clock, 270 degrees is 9 o'clock. Intermediate angles map naturally onto minute-hand positions, giving you a familiar frame of reference.",
      "During the flash, resist the urge to name a number. Instead, let your gaze passively register the line's slant so that your visual system encodes it pre-verbally. Verbally labelling an angle while it is still visible can actually interfere with the fine-grained visual representation.",
      "Mentally count tick marks from the nearest cardinal direction rather than estimating from zero. Relative judgements are more accurate than absolute ones when a reference is available.",
      "After locking in your answer, note whether you felt pulled toward a nearby cardinal angle. If so, try nudging your response a few degrees away from the cardinal — a conscious correction for categorical bias.",
      "Use the edge of the screen or the boundary of the circle as a horizon line. Judging the angle relative to a horizontal reference reduces reliance on pure memory and re-anchors the judgement in current perception.",
      "Track your personal weak zones across sessions: most people are systematically less accurate in one or two octants of the circle. Identifying yours lets you apply extra deliberate attention when the flash falls in those regions.",
    ],
    faq: [
      {
        q: "Why does the needle only appear for such a short time?",
        a: "The brief exposure is the core challenge: it prevents you from counting tick marks or thinking analytically during the stimulus, ensuring that what you reproduce reflects the precision of your visual memory rather than a deliberate measurement strategy.",
      },
      {
        q: "What does 0 degrees look like, and which direction does the angle increase?",
        a: "Zero degrees points straight up — like a compass bearing of north. The angle increases clockwise, so 90 degrees points to the right, 180 degrees points straight down, and 270 degrees points to the left.",
      },
      {
        q: "Are diagonal angles genuinely harder to remember than horizontal or vertical ones?",
        a: "Yes — this is the oblique effect in action. Your visual cortex devotes more neurons to cardinal orientations (0, 90, 180, 270 degrees) than to diagonals, and natural scenes contain far more horizontal and vertical edges, so the brain represents cardinals with higher fidelity. In practice you will likely find that a 45-degree or 135-degree target drifts more in memory than a near-vertical or near-horizontal one. Knowing this lets you apply deliberate extra care on oblique flashes.",
      },
      {
        q: "What is the oblique effect and will it affect my score?",
        a: "The oblique effect is the well-documented tendency for people to be more accurate at horizontal and vertical orientations than diagonal ones. It is a genuine property of how V1 is wired and how natural-scene statistics shape the visual system, so yes — you will likely find cardinal-direction targets easier to reproduce accurately than 45-degree or 135-degree angles.",
      },
      {
        q: "Can I improve my score with practice, or is this purely innate?",
        a: "Both factors are at play. The architecture of V1 sets a biological baseline, but working-memory fidelity for orientation can improve with training. Regular play builds metacognitive awareness of your personal bias patterns and helps you develop correction strategies, leading to measurable score improvements over time.",
      },
    ],
  },
  pt: {
    intro:
      "Angle desafia-te a memorizar a orientação de uma agulha em menos de um segundo e a reproduzi-la com precisão — um teste direto à tua memória de trabalho visual para ângulos.",
    metaTitle: "Angle – Jogo de Memória de Orientação | Senso",
    metaDescription:
      "Descobre quão bem te lembras de um ângulo depois de este desaparecer. Angle é um jogo de precisão percetual da coleção Senso que mede a tua memória de orientação.",
    keywords: [
      "jogo de ângulos",
      "memória de orientação",
      "perceção visual",
      "Senso jogos",
      "precisão percetual",
      "efeito oblíquo",
      "memória de trabalho visual",
      "estimativa de ângulos",
    ],
    whatItIs: [
      "Angle é um jogo de precisão percetual da coleção Senso. Em cada ronda, uma agulha parte do centro do ecrã e aponta para uma orientação durante menos de um segundo antes de desaparecer. A tua tarefa é rodar uma segunda agulha até esta corresponder ao ângulo escondido com a maior exatidão possível, confirmando depois a tua resposta.",
      "As orientações abrangem o círculo completo de 0 a 359 graus, sendo que 0 graus aponta diretamente para cima e o ângulo aumenta no sentido dos ponteiros do relógio — tal como uma marcação de bússola. Marcas subtis estão sempre visíveis à volta do mostrador como grelha de referência para ancorar a tua estimativa.",
      "Uma sessão completa é composta por cinco rondas. A pontuação de cada ronda baseia-se na proximidade entre o ângulo que reproduziste e o alvo, sendo a pontuação máxima total de 50 pontos. Como o jogo isola um único elemento percetual primitivo — a orientação — cada sessão é curta mas surpreendentemente reveladora da precisão da tua memória visual.",
    ],
    howToPlay: [
      "No início de cada ronda, uma agulha alvo aparece no ecrã por menos de um segundo. Observa-a com atenção: tenta registar não apenas um quadrante aproximado, mas a inclinação exata da linha. Assim que desaparecer, surge uma agulha móvel. Arrasta ou toca para a rodar até corresponder ao ângulo que acabaste de ver e confirma a resposta para avançar para a ronda seguinte.",
      "Usa as marcações como pontos de referência — contar as divisões a partir da direção cardinal mais próxima pode tornar a tua estimativa mais precisa. Uma estratégia complementar útil é associar o ângulo a uma referência familiar: posições dos ponteiros do relógio, orientações de bússola ou até a inclinação de um telhado funcionam bem como âncoras mentais.",
      "Como a exposição é breve, evita pensar demasiado durante o flash. Deixa que o teu sistema visual capture o ângulo de forma natural e reconstrói-o deliberadamente durante a fase de resposta. As cinco rondas passam rapidamente e a tua pontuação acumulada reflete a precisão global da tua memória de orientação, e não um resultado isolado de sorte ou azar.",
    ],
    science: [
      "A orientação é uma das características mais fundamentais que o sistema visual extrai de uma cena. Os neurónios do córtex visual primário (V1) são seletivamente sintonizados a linhas e contornos em ângulos específicos; David Hubel e Torsten Wiesel demonstraram esta arquitetura nos anos 1960, trabalho que lhes valeu o Prémio Nobel de Fisiologia ou Medicina em 1981. Estes neurónios organizam-se em colunas de orientação — módulos corticais repetidos em que células vizinhas respondem a orientações semelhantes — pelo que o cérebro mapeia efetivamente o espaço de orientações com um mapa neural dedicado.",
      "Apesar desta rica maquinaria neural, a perceção humana de orientação não é uniforme entre direções. O efeito oblíquo é um fenómeno bem replicado em que as pessoas julgam e memorizam orientações cardinais — horizontal (90 / 270 graus) e vertical (0 / 180 graus) — com maior exatidão do que orientações oblíquas ou diagonais. Dois fatores explicam este fenómeno: primeiro, mais neurónios de V1 estão sintonizados a orientações cardinais do que a diagonais; segundo, a estatística das cenas naturais é anisotrópica, com contornos horizontais e verticais muito mais prevalentes do que oblíquos, pelo que o sistema visual aprendeu a representar os cardinais com maior fidelidade. Podes notar este efeito diretamente ao jogar Angle — os alvos cardinais parecem mais fáceis de memorizar e reproduzir.",
      "Quando a agulha desaparece, entras num intervalo de retenção durante o qual a memória de trabalho visual tem de preservar a orientação. A memória de trabalho para características visuais de baixo nível como a orientação tem precisão limitada: a representação interna não é uma fotografia perfeita, mas uma estimativa ruidosa cuja incerteza cresce com a duração do intervalo. Investigação com paradigmas de resposta contínua semelhantes ao Angle demonstrou que os erros não são aleatórios; pelo contrário, as orientações recordadas são sistematicamente atraídas para referenciais categóricos — o eixo cardinal mais próximo ou um protótipo oblíquo aprendido. Este viés categórico pode levar-te a corrigir em excesso em direção a 0, 90, 180 ou 270 graus, mesmo quando o alvo real estava alguns graus afastado.",
      "A interação entre a força da codificação sensorial precoce e a fidelidade da memória de trabalho significa que a tua pontuação em Angle é uma medida composta: com que nitidez V1 captou a orientação durante a breve exposição, e quão bem a tua memória de trabalho a preservou ao longo do intervalo de retenção. Praticar o jogo pode aguçar a consciência metacognitiva sobre quais os ângulos que codificas com fiabilidade e quais tendem a desviar-se — uma perceção que se transfere para tarefas do mundo real envolvendo raciocínio espacial, desenho técnico e navegação.",
    ],
    scoring: [
      "A tua pontuação em cada ronda é determinada pela menor distância circular entre a tua resposta e o alvo — ou seja, min(|diferença|, 360 menos |diferença|) — pelo que o jogo mede sempre o menor arco possível entre as duas agulhas. Um acerto perfeito vale 10 pontos. O limiar de meia pontuação é de 14 graus: se o teu erro atingir ou ultrapassar esse valor, a pontuação da ronda cai para 5 ou menos, escalando linearmente até zero à medida que o erro aumenta.",
      "Ao longo de cinco rondas, o total máximo é de 50 pontos. Como a métrica de distância circular é simétrica, não existe viés direcional — errar 10 graus no sentido horário é penalizado de forma idêntica a errar 10 graus no sentido anti-horário.",
    ],
    tips: [
      "Converte mentalmente os ângulos em posições do relógio: 0 graus é 12 horas, 90 graus é 3 horas, 180 graus é 6 horas, 270 graus é 9 horas. Os ângulos intermédios mapeiam naturalmente para posições dos ponteiros dos minutos, fornecendo um referencial familiar.",
      "Durante o flash, resiste ao impulso de nomear um número. Em vez disso, deixa que o teu olhar registe passivamente a inclinação da linha para que o teu sistema visual a codifique de forma pré-verbal. Rotular verbalmente um ângulo enquanto ainda está visível pode interferir com a representação visual de grão fino.",
      "Conta mentalmente as marcações a partir da direção cardinal mais próxima em vez de estimar a partir do zero. Os julgamentos relativos são mais precisos do que os absolutos quando existe uma referência disponível.",
      "Depois de confirmar a resposta, nota se te sentiste atraído para um ângulo cardinal próximo. Se sim, tenta ajustar a resposta alguns graus para longe do cardinal — uma correção consciente do viés categórico.",
      "Usa a borda do ecrã ou o limite do círculo como linha de horizonte. Julgar o ângulo em relação a uma referência horizontal reduz a dependência da memória pura e reancora o julgamento na perceção atual.",
      "Regista as tuas zonas pessoais de fraqueza ao longo das sessões: a maioria das pessoas é sistematicamente menos precisa num ou dois octantes do círculo. Identificar os teus permite-te aplicar atenção deliberada extra quando o flash cai nessas regiões.",
    ],
    faq: [
      {
        q: "Porque é que a agulha aparece durante tão pouco tempo?",
        a: "A exposição breve é o desafio central: impede que contes marcações ou penses analiticamente durante o estímulo, garantindo que o que reproduzes reflete a precisão da tua memória visual e não uma estratégia de medição deliberada.",
      },
      {
        q: "Como é que 0 graus aparece no ecrã e em que direção aumenta o ângulo?",
        a: "Zero graus aponta diretamente para cima — como a marcação norte de uma bússola. O ângulo aumenta no sentido dos ponteiros do relógio, portanto 90 graus aponta para a direita, 180 graus aponta diretamente para baixo e 270 graus aponta para a esquerda.",
      },
      {
        q: "Os ângulos diagonais são genuinamente mais difíceis de memorizar do que os horizontais ou verticais?",
        a: "Sim — é o efeito oblíquo em ação. O teu córtex visual dedica mais neurónios às orientações cardinais (0, 90, 180, 270 graus) do que às diagonais, e as cenas naturais contêm muito mais contornos horizontais e verticais, pelo que o cérebro representa os cardinais com maior fidelidade. Na prática, é provável que um alvo de 45 ou 135 graus derive mais na memória do que um próximo do vertical ou do horizontal. Saber isto permite-te aplicar atenção deliberada extra nos flashes oblíquos.",
      },
      {
        q: "O que é o efeito oblíquo e vai afetar a minha pontuação?",
        a: "O efeito oblíquo é a tendência bem documentada para as pessoas serem mais precisas nas orientações horizontais e verticais do que nas diagonais. É uma propriedade genuína da forma como V1 está organizado e de como a estatística das cenas naturais molda o sistema visual, portanto sim — é provável que encontres os alvos de direção cardinal mais fáceis de reproduzir com exatidão do que os ângulos de 45 ou 135 graus.",
      },
      {
        q: "Consigo melhorar a pontuação com prática ou isto é puramente inato?",
        a: "Ambos os fatores estão em jogo. A arquitetura de V1 define uma linha de base biológica, mas a fidelidade da memória de trabalho para orientações pode melhorar com treino. Jogar regularmente desenvolve a consciência metacognitiva dos teus padrões de viés pessoais e ajuda-te a desenvolver estratégias de correção, conduzindo a melhorias mensuráveis na pontuação ao longo do tempo.",
      },
    ],
  },
};
