import type { LocalizedGameContent } from "@/games/content-types";

export const spotContent: LocalizedGameContent = {
  en: {
    intro:
      "Spot tests your memory for a single thing: where. A dot flashes somewhere, vanishes, and you mark the exact place it was. Pure visuospatial recall, scored on how far off you land.",
    metaTitle: "Spot — spatial memory game | Senso",
    metaDescription:
      "A dot flashes and disappears — mark where it was. Spot measures your visuospatial memory precision over five rounds, scored 0–50. Free, no account needed.",
    keywords: [
      "spatial memory game",
      "visuospatial memory",
      "position memory test",
      "where dot was",
      "spatial working memory",
      "memory precision",
      "perception game",
      "Senso",
    ],
    whatItIs: [
      "Spot isolates one of the most basic things your visual system does: registering where something is. A single dot appears in a square field for a fraction of a second, then disappears. Your job is to mark the exact spot it occupied, from memory.",
      "It is the sixth dimension in the Senso collection, and a deliberately different one. The other games ask what (a colour, a pitch) or how much (a duration, a quantity, an angle). Spot asks where — a question handled by a separate, specialised part of the brain, and one we tend to over-trust.",
      "Because the dot is shown only briefly and then removed, you cannot simply point at it; you have to hold its location in mind and reproduce it. That small delay is where the interesting errors live.",
    ],
    howToPlay: [
      "Tap to begin the round. A dot flashes in the field for about seven tenths of a second, then vanishes. Watch carefully but do not move your cursor yet — the goal is to remember, not to track.",
      "Once the field is empty, tap or click where you believe the dot was. You can drag to fine-tune, or nudge with the arrow keys (hold Shift for larger steps), then press Lock in to commit.",
      "After five rounds you get a total out of 50, with each round showing the true position beside your guess so you can see your personal bias — many people drift toward the centre.",
    ],
    science: [
      "Vision is split into two broad streams. The ventral or \"what\" stream (down into the temporal lobe) identifies objects; the dorsal or \"where\" stream (up into the parietal lobe) encodes location and guides action. Spot probes the dorsal stream and the spatial working memory that briefly stores a location after it disappears.",
      "That memory is precise but not perfect, and it is biased in a predictable way. The category-adjustment model (Huttenlocher and colleagues) shows that when we are unsure of an exact position, we unconsciously blend it with the prototype of the region it fell in — often pulling remembered points toward the centre of a quadrant or the middle of the field. Your per-round breakdown will often reveal exactly this inward drift.",
      "Precision also decays with time and competition. Even a short delay, or having to remember more than one location at once, widens the spread of errors — spatial working memory has limited resolution and capacity. Where you happened to be looking matters too: we localise most accurately near the point of fixation, and less well in the periphery.",
      "None of this is a flaw so much as a strategy. The brain stores a compressed, gist-plus-detail representation of space rather than a pixel-perfect snapshot, trading a little accuracy for speed and robustness. Spot makes that trade-off visible.",
    ],
    scoring: [
      "Each round is scored on the straight-line (Euclidean) distance between the true dot and your mark, measured as a fraction of the field's width. Landing exactly on the dot is zero error and a perfect 10; the score then follows Senso's shared curve, halving every time the distance grows by the half-score amount.",
      "For Spot the half-score distance is about twelve percent of the field — miss by that much and you still earn a respectable 5 out of 10. Five rounds add up to a maximum of 50. Because people are genuinely good at spatial memory, strong scores here tend to be a little higher than in the trickier senses.",
    ],
    tips: [
      "Fixate the dot the instant it appears rather than letting your eyes wander — you localise best near where you were looking.",
      "Anchor the position relative to the field's edges and centre (\"upper third, just right of middle\") instead of as a free-floating point.",
      "Resist the pull toward the centre; if you feel unsure, your true memory is usually a bit more extreme than your first instinct.",
      "Commit quickly. The longer you deliberate, the more the remembered location decays and drifts.",
      "Use the arrow keys for the final pixel of adjustment once your tap is roughly right.",
    ],
    faq: [
      {
        q: "Is Spot just a reaction or aiming test?",
        a: "No. The dot is gone before you respond, so there is nothing to aim at — it measures memory for a location, not speed or hand-eye tracking.",
      },
      {
        q: "Why do my guesses keep landing toward the middle?",
        a: "That is the well-documented category-adjustment bias: uncertain positions get pulled toward the prototype of their region. Noticing it is the first step to correcting for it.",
      },
      {
        q: "Does screen size or device change my score?",
        a: "No. Error is measured as a fraction of the field, which scales with your screen, so phone and desktop are scored the same way.",
      },
      {
        q: "How is the position chosen, and is it the same for everyone?",
        a: "Positions are generated deterministically from a seed. The daily challenge uses one worldwide seed per day, and challenge links replay the exact same set of dots.",
      },
      {
        q: "What is a good Spot score?",
        a: "Spatial memory is a strength for most people, so mid-30s out of 50 is solid and the low 40s is excellent. A flawless 45+ is rare.",
      },
    ],
  },
  pt: {
    intro:
      "O Spot testa a tua memória para uma única coisa: onde. Um ponto pisca algures, desaparece, e tu marcas o sítio exato onde estava. Recordação visuoespacial pura, pontuada pela distância a que ficas.",
    metaTitle: "Spot — jogo de memória espacial | Senso",
    metaDescription:
      "Um ponto pisca e desaparece — marca onde estava. O Spot mede a precisão da tua memória visuoespacial em cinco rondas, pontuado 0–50. Grátis, sem conta.",
    keywords: [
      "jogo de memória espacial",
      "memória visuoespacial",
      "teste de memória de posição",
      "onde estava o ponto",
      "memória de trabalho espacial",
      "precisão de memória",
      "jogo de perceção",
      "Senso",
    ],
    whatItIs: [
      "O Spot isola uma das coisas mais básicas que o teu sistema visual faz: registar onde está algo. Um único ponto aparece num campo quadrado durante uma fração de segundo e depois desaparece. A tua tarefa é marcar o sítio exato que ocupava, de memória.",
      "É a sexta dimensão da coleção Senso, e propositadamente diferente. Os outros jogos perguntam o quê (uma cor, um tom) ou quanto (uma duração, uma quantidade, um ângulo). O Spot pergunta onde — uma questão tratada por uma parte distinta e especializada do cérebro, e na qual tendemos a confiar demais.",
      "Como o ponto é mostrado apenas por instantes e depois retirado, não podes simplesmente apontar para ele; tens de guardar a sua localização na mente e reproduzi-la. É nesse pequeno intervalo que vivem os erros interessantes.",
    ],
    howToPlay: [
      "Toca para começar a ronda. Um ponto pisca no campo durante cerca de sete décimos de segundo e depois desaparece. Observa com atenção, mas não mexas ainda o cursor — o objetivo é recordar, não seguir.",
      "Quando o campo ficar vazio, toca ou clica onde achas que o ponto estava. Podes arrastar para afinar, ou ajustar com as setas (com Shift para passos maiores), e depois carregar em Confirmar.",
      "Ao fim de cinco rondas tens um total em 50, e cada ronda mostra a posição verdadeira ao lado da tua resposta para veres o teu próprio enviesamento — muita gente puxa para o centro.",
    ],
    science: [
      "A visão divide-se em duas grandes vias. A via ventral ou do \"quê\" (descendo pelo lobo temporal) identifica objetos; a via dorsal ou do \"onde\" (subindo pelo lobo parietal) codifica a localização e guia a ação. O Spot sonda a via dorsal e a memória de trabalho espacial que guarda brevemente uma localização depois de ela desaparecer.",
      "Essa memória é precisa, mas não perfeita, e está enviesada de forma previsível. O modelo de ajuste categórico (Huttenlocher e colegas) mostra que, quando não temos a certeza de uma posição exata, fundimo-la inconscientemente com o protótipo da região em que caiu — puxando muitas vezes os pontos recordados para o centro de um quadrante ou para o meio do campo. O teu detalhe por ronda revela frequentemente este desvio para dentro.",
      "A precisão também decai com o tempo e com a competição. Mesmo um curto atraso, ou ter de recordar mais do que uma localização ao mesmo tempo, alarga a dispersão dos erros — a memória de trabalho espacial tem resolução e capacidade limitadas. O sítio para onde estavas a olhar também conta: localizamos com mais exatidão perto do ponto de fixação e pior na periferia.",
      "Nada disto é bem um defeito, mas uma estratégia. O cérebro guarda uma representação comprimida — essência mais detalhe — do espaço, em vez de um instantâneo perfeito ao pixel, trocando um pouco de exatidão por rapidez e robustez. O Spot torna essa troca visível.",
    ],
    scoring: [
      "Cada ronda é pontuada pela distância em linha reta (euclidiana) entre o ponto verdadeiro e a tua marca, medida como fração da largura do campo. Acertar em cheio no ponto é erro zero e um 10 perfeito; a pontuação segue depois a curva partilhada do Senso, reduzindo-se para metade sempre que a distância cresce o valor de meia pontuação.",
      "No Spot, a distância de meia pontuação é cerca de doze por cento do campo — falha por essa margem e ainda ganhas uns respeitáveis 5 em 10. Cinco rondas somam um máximo de 50. Como as pessoas são genuinamente boas em memória espacial, as boas pontuações aqui tendem a ser um pouco mais altas do que nos sentidos mais difíceis.",
    ],
    tips: [
      "Fixa o ponto no instante em que aparece, em vez de deixar os olhos vaguear — localizas melhor perto de onde estavas a olhar.",
      "Ancora a posição em relação às margens e ao centro do campo (\"terço superior, logo à direita do meio\") em vez de a tratares como um ponto solto.",
      "Resiste à atração para o centro; se te sentes inseguro, a tua memória real costuma ser um pouco mais extrema do que o primeiro instinto.",
      "Decide depressa. Quanto mais deliberas, mais a localização recordada decai e desliza.",
      "Usa as setas para o último ajuste fino depois de o toque estar mais ou menos certo.",
    ],
    faq: [
      {
        q: "O Spot é só um teste de reação ou de pontaria?",
        a: "Não. O ponto desaparece antes de responderes, por isso não há nada para apontar — mede a memória de uma localização, não a velocidade nem a coordenação olho-mão.",
      },
      {
        q: "Porque é que as minhas respostas caem sempre para o meio?",
        a: "É o conhecido enviesamento de ajuste categórico: posições incertas são puxadas para o protótipo da sua região. Reparar nisso é o primeiro passo para o corrigir.",
      },
      {
        q: "O tamanho do ecrã ou o dispositivo alteram a pontuação?",
        a: "Não. O erro é medido como fração do campo, que escala com o teu ecrã, por isso telemóvel e computador são pontuados da mesma forma.",
      },
      {
        q: "Como é escolhida a posição, e é igual para toda a gente?",
        a: "As posições são geradas deterministicamente a partir de uma semente. O desafio diário usa uma semente mundial por dia, e as ligações de desafio repetem exatamente o mesmo conjunto de pontos.",
      },
      {
        q: "O que é uma boa pontuação no Spot?",
        a: "A memória espacial é um ponto forte para a maioria, por isso uns 30 e poucos em 50 é sólido e o início dos 40 é excelente. Um 45+ impecável é raro.",
      },
    ],
  },
};
