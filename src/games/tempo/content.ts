import type { LocalizedGameContent } from "@/games/content-types";

export const tempoContent: LocalizedGameContent = {
  en: {
    intro:
      "Tempo trains your internal clock: watch a flash of light, then hold for exactly as long as it lasted — pure duration memory, no counting allowed.",

    metaTitle: "Tempo – Duration Memory Game | Senso",

    metaDescription:
      "Play Tempo on Senso and sharpen your sense of time. Watch a timed flash, then reproduce its duration by touch. Train your internal clock with science-backed feedback.",

    keywords: [
      "duration memory game",
      "interval timing",
      "internal clock training",
      "time perception game",
      "Senso Tempo",
      "perceptual precision",
      "scalar expectancy",
      "time reproduction task",
    ],

    whatItIs: [
      "Tempo is a duration-reproduction challenge in the Senso collection of perceptual precision games. A full-screen pad lights up for a target interval, then goes dark. Your job is to press and hold the pad for exactly the same length of time, releasing to lock in your answer. No numbers, no countdown — just you and your sense of how long things last.",
      "The game runs for five rounds. Target durations range from 0.6 to 3.0 seconds, sampled in log space so short and long intervals are represented equally, which keeps every round feeling genuinely different.",
      "Because humans judge time in ratios rather than absolute milliseconds, your score is calculated the same way. A small proportional miss on a 4-second interval is no worse than the same proportional miss on a 0.8-second one. The playing field stays level across the full range of durations.",
    ],

    howToPlay: [
      "Each round begins the moment the pad lights up. Watch the glow carefully — it may be brief or surprisingly long. When it disappears, the pad is waiting for your response. Press and hold it for as long as you believe the flash lasted, then release. Your reproduction is locked in on release, not on press.",
      "Try not to count silently — Tempo is designed to tap into felt duration, not arithmetic. Rushing to release early inflates your score just as much as overshooting. Stay relaxed: tension and arousal are known to distort time perception, making intervals feel longer than they are.",
      "After each round you will see how close your hold time was to the target, along with a per-round score. Five rounds complete a game, with a maximum total of 50 points. The summary screen shows your consistency across rounds, so you can track whether your internal clock is drifting in a particular direction.",
    ],

    science: [
      "Humans have no dedicated time organ. Unlike vision or touch, interval timing in the seconds range is thought to emerge from neural dynamics spread across several brain systems rather than a single receptor. The most influential model is the pacemaker-accumulator framework, sometimes called Scalar Expectancy Theory (SET). In this model, a central pacemaker emits pulses that a cognitive accumulator counts while attention is directed to the interval. When the interval ends, the count is stored in working memory as the reference duration.",
      "The defining feature of Scalar Expectancy Theory is the scalar property: the standard deviation of time estimates grows in proportion to the interval being timed. If your error on a one-second interval is, say, 10%, your error on a four-second interval will also be around 10% — not a fixed number of milliseconds. This is a temporal form of Weber's law, the same principle that governs loudness discrimination, weight comparison, and many other perceptual judgments. It is why Tempo scores your response using a log-ratio metric rather than a raw millisecond difference: a half-score error corresponds to the same proportional deviation regardless of how long the target was.",
      "Working memory plays a critical role in the reproduction task. Once the flash disappears, you must hold its duration as an active representation while you produce the matching interval. Any distraction that occupies working memory — a stray thought, a background sound — can shorten or lengthen that stored trace. Attention also matters in the opposite direction: when you pay close attention to an empty interval it tends to feel longer, because more clock pulses are accumulated. The familiar experience of a watched pot that never boils is a real psychophysical effect, not a figure of speech.",
      "Neuroscience research points to a network of regions involved in interval timing. The basal ganglia appear central to the pacemaker-accumulator mechanism and are implicated in timing in the range Tempo uses. The cerebellum contributes more to automatic, sub-second timing and motor synchronisation. The supplementary motor area is consistently activated during time reproduction tasks, linking time perception to the motor preparation required to produce a response. Training your interval timing, as Tempo encourages, likely strengthens the precision of these circuits over repeated practice.",
    ],

    scoring: [
      "Each round is scored from 0 to 10. The error is computed as the absolute log2 ratio of your hold time to the target duration — that is, |log2(your seconds / target seconds)|. This measure is symmetric and scale-invariant: being twice as long or half as short produces the same error of 1.0. A ratio error of 0.16 (roughly a 12% proportional miss) earns exactly 5 out of 10.",
      "Five rounds give a maximum of 50 points per game. Because the metric is proportional, you are judged on relative accuracy rather than absolute milliseconds, and both very short and very long targets are equally fair. Consistent performance across all five rounds — even if no single round is perfect — will outscore a game where one round is a bullseye and others drift wide.",
    ],

    tips: [
      "Breathe evenly before each round. Physical tension raises arousal and tends to make intervals feel subjectively longer, pulling your hold time over the target.",
      "Resist counting. Verbal counting recruits a different cognitive channel than felt duration and tends to fragment your sense of time rather than sharpen it.",
      "Stay focused on the pad during the flash. Dividing attention away from the stimulus reduces the number of pulses accumulated and causes underestimation.",
      "Use a consistent release motion. Mechanical hesitation at the end of your hold adds variable latency; a clean, decisive lift keeps your responses precise.",
      "Review the round summary for systematic bias. If you consistently overshoot or undershoot, shift your mental anchor slightly before the next game rather than trying to correct mid-round.",
      "Play a short warm-up game before pushing for high scores. Your internal clock needs a few trials to calibrate to the current task context.",
    ],

    faq: [
      {
        q: "Why does Tempo score with a ratio instead of milliseconds?",
        a: "Because human time perception obeys the scalar property: errors grow proportionally with the interval, not in fixed milliseconds. A 10% miss on a short target is just as hard to avoid as a 10% miss on a long one. The log-ratio metric reflects that reality and keeps every round equally fair.",
      },
      {
        q: "Does playing Tempo actually improve time perception?",
        a: "Research on interval timing training suggests that practice can improve precision, especially when augmented with feedback. Tempo provides per-round error information after every response, which is the type of feedback most associated with perceptual learning. Consistent play over many sessions is more likely to produce lasting improvement than a single high-score run.",
      },
      {
        q: "Does counting silently in your head help or hurt your score?",
        a: "It tends to hurt. Silent counting recruits verbal working memory, which competes with the felt-duration representation you are trying to preserve. Studies on dual-task timing show that verbal interference shortens perceived duration, so a counting strategy will systematically pull your reproductions under the target. The most reliable performers rely on a bodily sense of elapsed time rather than discrete counts.",
      },
      {
        q: "Should I close my eyes during the flash?",
        a: "Most people find that keeping their eyes on the pad improves accuracy because visual attention tightly couples to the timing mechanism. Closing your eyes removes the sharp on/off visual boundary and can introduce uncertainty about exactly when the interval started and ended.",
      },
      {
        q: "What counts as the start of my hold?",
        a: "Your hold time is measured from the moment you press the pad to the moment you release. The pad registers the press immediately, so there is no delay penalty for pressing promptly when the flash ends. Release — not press — is when your reproduction is locked in.",
      },
    ],
  },

  pt: {
    intro:
      "O Tempo treina o teu relógio interno: observa um flash de luz e mantém pressionado exactamente durante o mesmo tempo — memória de duração pura, sem contagens.",

    metaTitle: "Tempo – Jogo de Memória de Duração | Senso",

    metaDescription:
      "Joga Tempo no Senso e afina o teu sentido do tempo. Observa um flash cronometrado e reproduz a sua duração com um toque. Treina o relógio interno com feedback científico.",

    keywords: [
      "jogo de memória de duração",
      "timing de intervalos",
      "treino do relógio interno",
      "jogo de percepção do tempo",
      "Senso Tempo",
      "precisão perceptual",
      "expectativa escalar",
      "tarefa de reprodução temporal",
    ],

    whatItIs: [
      "O Tempo é um desafio de reprodução de duração da colecção Senso de jogos de precisão perceptual. Um painel em ecrã completo ilumina-se durante um intervalo-alvo e apaga-se. A tua tarefa é pressionar e manter o painel exatamente durante o mesmo tempo, soltando para confirmar a resposta. Sem números, sem contagem decrescente — apenas tu e o teu sentido de quanto tempo as coisas demoram.",
      "O jogo decorre ao longo de cinco rondas. As durações-alvo variam entre 0,6 e 3,0 segundos, amostradas em escala logarítmica para que intervalos curtos e longos estejam igualmente representados, tornando cada ronda genuinamente diferente.",
      "Como os humanos julgam o tempo em proporções e não em milissegundos absolutos, a pontuação é calculada da mesma forma. Um desvio proporcional pequeno num intervalo de 4 segundos não é penalizado mais do que o mesmo desvio proporcional num de 0,8 segundos. O campo de jogo mantém-se nivelado ao longo de toda a gama de durações.",
    ],

    howToPlay: [
      "Cada ronda começa no momento em que o painel se ilumina. Observa com atenção — pode ser breve ou surpreendentemente longo. Quando desaparece, o painel está à espera da tua resposta. Pressiona e mantém durante o tempo que acreditas que o flash durou, depois solta. A tua reprodução fica registada no momento em que soltas, não quando pressiona.",
      "Tenta não contar em silêncio — o Tempo foi concebido para activar a duração sentida, não a aritmética. Soltar cedo infla a pontuação tanto quanto exceder o alvo. Mantém-te relaxado: a tensão e o estado de alerta distorcem a percepção do tempo, fazendo os intervalos parecerem mais longos do que são.",
      "Após cada ronda verás o quão próximo o teu tempo de pressão ficou do alvo, juntamente com a pontuação da ronda. Cinco rondas completam um jogo, com um máximo de 50 pontos. O ecrã de resumo mostra a tua consistência ao longo das rondas, para poderes perceber se o teu relógio interno está a derivar numa determinada direcção.",
    ],

    science: [
      "Os humanos não têm um órgão dedicado ao tempo. Ao contrário da visão ou do toque, o timing de intervalos na escala de segundos emerge de dinâmicas neurais distribuídas por vários sistemas cerebrais, não de um único receptor. O modelo mais influente é a estrutura pacemaker-acumulador, conhecida como Teoria da Expectativa Escalar (SET). Neste modelo, um pacemaker central emite pulsos que um acumulador cognitivo conta enquanto a atenção está dirigida ao intervalo. Quando o intervalo termina, a contagem é armazenada na memória de trabalho como duração de referência.",
      "A característica definidora da Teoria da Expectativa Escalar é a propriedade escalar: o desvio-padrão das estimativas de tempo cresce em proporção ao intervalo cronometrado. Se o teu erro num intervalo de um segundo for, digamos, 10%, o erro num intervalo de quatro segundos será também cerca de 10% — não um número fixo de milissegundos. Esta é uma forma temporal da lei de Weber, o mesmo princípio que governa a discriminação de intensidade sonora, a comparação de pesos e muitos outros julgamentos perceptuais. É por isso que o Tempo pontua a resposta com uma métrica de rácio logarítmico em vez de uma diferença em milissegundos: um erro de meia pontuação corresponde ao mesmo desvio proporcional independentemente da duração do alvo.",
      "A memória de trabalho desempenha um papel crucial na tarefa de reprodução. Depois do flash desaparecer, tens de manter a sua duração como representação activa enquanto produzes o intervalo correspondente. Qualquer distracção que ocupe a memória de trabalho — um pensamento passageiro, um som de fundo — pode encurtar ou alongar esse registo armazenado. A atenção também importa na direcção oposta: quando prestas muita atenção a um intervalo vazio, ele tende a parecer mais longo, porque são acumulados mais pulsos de relógio. A familiar experiência de olhar para uma panela que parece nunca ferver é um efeito psicofísico real, não apenas uma figura de estilo.",
      "A investigação em neurociência aponta para uma rede de regiões envolvidas no timing de intervalos. Os gânglios da base parecem centrais no mecanismo pacemaker-acumulador e estão implicados no timing na gama que o Tempo utiliza. O cerebelo contribui mais para o timing automático sub-segundo e para a sincronização motora. A área motora suplementar é consistentemente activada durante tarefas de reprodução temporal, ligando a percepção do tempo à preparação motora necessária para produzir uma resposta. Treinar o timing de intervalos, como o Tempo incentiva, fortalece provavelmente a precisão destes circuitos ao longo de prática repetida.",
    ],

    scoring: [
      "Cada ronda é pontuada de 0 a 10. O erro é calculado como o rácio logarítmico absoluto em base 2 entre o teu tempo de pressão e a duração-alvo — ou seja, |log2(os teus segundos / segundos do alvo)|. Esta medida é simétrica e invariante de escala: durar o dobro ou metade do tempo produz o mesmo erro de 1,0. Um erro de rácio de 0,16 (aproximadamente 12% de desvio proporcional) dá exactamente 5 em 10.",
      "Cinco rondas dão um máximo de 50 pontos por jogo. Como a métrica é proporcional, és avaliado com base na precisão relativa e não em milissegundos absolutos, e tanto alvos muito curtos como muito longos são igualmente justos. Um desempenho consistente ao longo das cinco rondas — mesmo que nenhuma seja perfeita — supera um jogo em que uma ronda é um acerto e as restantes desviam muito.",
    ],

    tips: [
      "Respira de forma regular antes de cada ronda. A tensão física aumenta o estado de alerta e tende a fazer com que os intervalos pareçam subjectivamente mais longos, puxando o teu tempo de pressão para além do alvo.",
      "Evita contar. A contagem verbal recruta um canal cognitivo diferente da duração sentida e tende a fragmentar o teu sentido do tempo em vez de o afinar.",
      "Mantém o foco no painel durante o flash. Dividir a atenção reduz o número de pulsos acumulados e provoca subestimação.",
      "Usa um movimento de soltar consistente. A hesitação mecânica no final da pressão adiciona latência variável; um levantamento limpo e decisivo mantém as respostas precisas.",
      "Analisa o resumo da ronda para detectar tendências sistemáticas. Se excedes ou ficas consistentemente aquém, ajusta ligeiramente a tua referência mental antes do próximo jogo em vez de tentares corrigir a meio da ronda.",
      "Joga uma partida de aquecimento antes de tentares pontuações altas. O teu relógio interno precisa de algumas tentativas para se calibrar ao contexto actual da tarefa.",
    ],

    faq: [
      {
        q: "Por que é que o Tempo pontua com um rácio em vez de milissegundos?",
        a: "Porque a percepção humana do tempo obedece à propriedade escalar: os erros crescem proporcionalmente ao intervalo, não em milissegundos fixos. Um desvio de 10% num alvo curto é tão difícil de evitar como um desvio de 10% num alvo longo. A métrica de rácio logarítmico reflecte essa realidade e mantém todas as rondas igualmente justas.",
      },
      {
        q: "Jogar o Tempo melhora realmente a percepção do tempo?",
        a: "A investigação sobre treino de timing de intervalos sugere que a prática pode melhorar a precisão, especialmente quando complementada com feedback. O Tempo fornece informação sobre o erro de cada ronda após cada resposta, que é o tipo de feedback mais associado à aprendizagem perceptual. Uma prática consistente ao longo de muitas sessões tem maior probabilidade de produzir melhorias duradouras do que uma única sessão de pontuação alta.",
      },
      {
        q: "Contar em silêncio na cabeça ajuda ou prejudica a pontuação?",
        a: "Tende a prejudicar. A contagem silenciosa recruta a memória de trabalho verbal, que compete com a representação de duração sentida que estás a tentar preservar. Estudos sobre timing em dupla-tarefa mostram que a interferência verbal encurta a duração percepcionada, pelo que uma estratégia de contagem vai sistematicamente puxar as tuas reproduções abaixo do alvo. Os melhores desempenhos baseiam-se num sentido corporal do tempo decorrido, em vez de contagens discretas.",
      },
      {
        q: "Devo fechar os olhos durante o flash?",
        a: "A maioria das pessoas obtém maior precisão mantendo os olhos no painel, porque a atenção visual acopla estreitamente ao mecanismo de timing. Fechar os olhos remove a fronteira visual nítida de início/fim e pode introduzir incerteza sobre exactamente quando o intervalo começou e terminou.",
      },
      {
        q: "O que conta como início da minha pressão?",
        a: "O teu tempo de pressão é medido desde o momento em que pressionas o painel até ao momento em que soltas. O painel regista a pressão imediatamente, por isso não há penalização por pressionar prontamente quando o flash termina. Soltar — não pressionar — é quando a tua reprodução fica registada.",
      },
    ],
  },
};
