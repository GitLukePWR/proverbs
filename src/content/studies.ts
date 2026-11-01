import type { ProverbStudy } from '../domain/types';

/**
 * Curated Wize studies.
 *
 * - Scripture text is NOT stored here; it is looked up from the selected
 *   translation by chapter and verse (see `library.ts`), so the wording always
 *   comes verbatim from the source translation.
 * - `meaning`, `practice`, `prompts` and `context` are original Wize writing.
 *   They are interpretation, not Scripture, and are labelled as such in the UI.
 * - IDs are permanent. Journal entries reference them, so never rename or reuse one.
 * - Order matters for daily selection: append new studies to the END of the list.
 */
export const STUDIES: ProverbStudy[] = [
  {
    id: 'prov-3-5-6',
    book: 'Proverbs',
    chapter: 3,
    verseStart: 5,
    verseEnd: 6,
    topics: ['faith', 'decisions', 'humility'],
    meaning:
      'Lean your full weight on God rather than on your own read of the situation. This is not a call to stop thinking; it is a warning against treating your own perspective as the final word. "Acknowledge him in all your ways" means bringing every area of life, not just the religious parts, under God\'s direction. A "straight path" is a life that holds together and keeps moving forward instead of looping back on itself.',
    practice:
      'Before one decision you face today, pause and name out loud (or on paper) what you are assuming. Then ask honestly whether you would still choose the same way if you held those assumptions more loosely.',
    prompts: {
      understand: 'Why might the proverb set "all your heart" against "your own understanding"? What is the difference between using your mind and leaning on it?',
      reflect: 'Where are you currently relying most on your own reading of a situation — a relationship, a career move, a worry?',
      act: 'What would it look like to "acknowledge him" in one ordinary part of your day tomorrow?',
    },
    context:
      '"Yahweh" is the personal name of God in the Hebrew Bible. Many English translations render it "the LORD" in small capitals.',
  },
  {
    id: 'prov-1-7',
    book: 'Proverbs',
    chapter: 1,
    verseStart: 7,
    topics: ['wisdom', 'faith', 'humility'],
    meaning:
      'This is the thesis statement of the whole book. "The fear of Yahweh" is not terror; it is the deep respect that comes from recognising God is God and you are not. That posture is where real knowledge starts, because it makes you teachable. The contrast is the fool, who is not unintelligent but unwilling — someone who refuses instruction because they have already decided they know enough.',
    practice:
      'Ask someone you respect for honest feedback on one thing you do regularly — your work, your parenting, your listening — and receive it without defending yourself.',
    prompts: {
      understand: 'Why would reverence be the starting point for knowledge rather than intelligence or experience?',
      reflect: 'In what area of your life have you quietly stopped being willing to learn?',
      act: 'What is one piece of instruction or correction you have been resisting that you could take seriously this week?',
    },
    context:
      'Proverbs 1:7 functions as a motto for the book. The same idea frames the end of the main collection (9:10) and the final poem (31:30).',
  },
  {
    id: 'prov-4-23',
    book: 'Proverbs',
    chapter: 4,
    verseStart: 23,
    topics: ['wisdom', 'emotions', 'discipline'],
    meaning:
      'In Hebrew thought the "heart" is not just feelings; it is the control centre of a person — thoughts, desires, choices and loyalties. The proverb says to guard it carefully, because everything else in your life flows out of it, like water from a spring. If the source is polluted, everything downstream is affected. What you repeatedly let into your attention slowly shapes who you become.',
    practice:
      'Notice the first three things you give your attention to tomorrow morning. If one of them reliably leaves you anxious, envious or numb, replace it with something that steadies you.',
    prompts: {
      understand: 'Why does the proverb describe the heart as a "wellspring" rather than, say, a container?',
      reflect: 'What is flowing into your heart most often at the moment — through your phone, conversations, or habits of thought?',
      act: 'What is one boundary you could set this week to guard what shapes you?',
    },
  },
  {
    id: 'prov-15-1',
    book: 'Proverbs',
    chapter: 15,
    verseStart: 1,
    topics: ['speech', 'relationships', 'emotions'],
    meaning:
      'How you respond often decides where a conflict goes next. A calm, gentle reply can take the heat out of someone\'s anger, while a sharp word adds fuel. Gentle does not mean weak or dishonest; you can say something hard in a soft way. Think of a tense email thread at work: the person who replies calmly and specifically usually ends the fight, while the one who replies in kind prolongs it.',
    practice:
      'The next time someone speaks to you with irritation today, lower your voice and slow down your reply on purpose, even if what you need to say is firm.',
    prompts: {
      understand: 'Why does a gentle answer have power over anger, rather than appearing to lose the argument?',
      reflect: 'Think of a recent conflict. Did your words turn it down or stir it up?',
      act: 'Is there a conversation you need to have where you could plan a gentle opening line?',
    },
  },
  {
    id: 'prov-27-17',
    book: 'Proverbs',
    chapter: 27,
    verseStart: 17,
    topics: ['relationships', 'wisdom'],
    meaning:
      'Just as one iron blade can be used to sharpen another, people sharpen each other. The image involves friction: sharpening only happens through contact, honest disagreement and challenge. The WEB\'s "countenance" literally means "face" — the whole person is shaped by the friendship. Friends who only ever agree with you can be pleasant but leave you dull; the ones who push back make you better.',
    practice:
      'Message one friend who tends to challenge you and ask their honest opinion on something you are currently thinking through.',
    prompts: {
      understand: 'What does the image of iron on iron suggest about the role of friction in good friendships?',
      reflect: 'Who in your life sharpens you? Who do you avoid because they might?',
      act: 'How could you be a sharpening presence for someone else, honestly and kindly, this week?',
    },
  },
  {
    id: 'prov-16-18',
    book: 'Proverbs',
    chapter: 16,
    verseStart: 18,
    topics: ['humility', 'wisdom'],
    meaning:
      'Pride tends to come right before a collapse. When we become arrogant, we stop listening, stop checking our work and start taking risks we would once have questioned. The fall is not always a dramatic punishment; often it is the natural consequence of blind spots that pride refused to see. Many failed businesses, relationships and careers can trace their unravelling to a season of "I don\'t need anyone\'s input."',
    practice:
      'Identify one area where you feel most confident right now, and ask someone to point out what you might be missing there.',
    prompts: {
      understand: 'Why does pride make a fall more likely, not just more embarrassing?',
      reflect: 'Where might confidence have quietly turned into a refusal to be questioned in your life?',
      act: 'What is one safeguard you could put in place against your own blind spots?',
    },
  },
  {
    id: 'prov-18-21',
    book: 'Proverbs',
    chapter: 18,
    verseStart: 21,
    topics: ['speech'],
    meaning:
      'Words carry enormous power — they can build someone up or break them down. The second line adds a twist: those who "love" the tongue, people who talk a lot, will live with the results of their words, good or bad. Speech is like planting: what you say comes back as a harvest. A habit of encouragement grows trust; a habit of sarcasm or gossip grows something else.',
    practice:
      'Choose one person today and say something specific and true that gives them life — a word of thanks, encouragement or recognition.',
    prompts: {
      understand: 'What does it mean to "eat the fruit" of your tongue?',
      reflect: 'What kind of harvest are your recent words producing at home or at work?',
      act: 'What is one habit of speech you want to stop, and one you want to start?',
    },
  },
  {
    id: 'prov-6-6-8',
    book: 'Proverbs',
    chapter: 6,
    verseStart: 6,
    verseEnd: 8,
    topics: ['work', 'discipline'],
    meaning:
      'The "sluggard" is someone habitually lazy. Instead of a lecture, the proverb points to an ant. Ants have no manager standing over them, yet they work steadily and prepare in summer for the winter ahead. The lesson is self-motivation and foresight: doing what needs to be done before it becomes urgent, without needing someone to make you.',
    practice:
      'Pick one task you have been putting off because no one is checking on it, and do the first fifteen minutes of it today.',
    prompts: {
      understand: 'What specifically does the ant model that the "sluggard" lacks?',
      reflect: 'Where do you only act when someone else is watching or a deadline is looming?',
      act: 'What is one "summer" preparation you could make now for a future season?',
    },
    context:
      'Verses 6–8 are a short wisdom poem built on observing nature, a common technique in Proverbs and in ancient Near Eastern wisdom writing.',
  },
  {
    id: 'prov-10-4',
    book: 'Proverbs',
    chapter: 10,
    verseStart: 4,
    topics: ['work', 'money', 'discipline'],
    meaning:
      'Careless, half-hearted work tends to lead to poverty, while consistent effort tends to build up resources over time. Like much of Proverbs, this describes a general pattern, not a guarantee — elsewhere the book acknowledges injustice and hardship that hard work cannot fix. But it remains true that steady diligence usually compounds, while a "lazy hand" slowly erodes what you have.',
    practice:
      'Choose the most important task on your list today and give it your full attention for one uninterrupted block of time.',
    prompts: {
      understand: 'Why might Proverbs present this as a general pattern rather than a promise?',
      reflect: 'Where in your work or responsibilities is your hand currently "lazy"?',
      act: 'What would diligence look like in one small, unglamorous task this week?',
    },
    context:
      'Proverbs typically states general truths. Elsewhere the book recognises that poverty can result from injustice rather than laziness (13:23), and that a little gained honestly is better than great wealth gained unjustly (16:8).',
  },
  {
    id: 'prov-10-9',
    book: 'Proverbs',
    chapter: 10,
    verseStart: 9,
    topics: ['integrity'],
    meaning:
      'A person of integrity can walk through life with security, because they have nothing to hide and no story to keep straight. Someone who takes crooked shortcuts lives with the constant risk of being found out — and eventually, the proverb says, they will be. Honesty is not only right; it is lighter to carry. There is freedom in having the same character in private as in public.',
    practice:
      'If there is a small dishonesty you are maintaining — an inflated claim, a hidden expense, an excuse — correct it today.',
    prompts: {
      understand: 'Why does the proverb connect integrity with walking "surely" or securely?',
      reflect: 'Is there anything in your life you would be uncomfortable having "found out"?',
      act: 'What is one step toward living the same way in private and in public?',
    },
  },
  {
    id: 'prov-11-2',
    book: 'Proverbs',
    chapter: 11,
    verseStart: 2,
    topics: ['humility', 'wisdom'],
    meaning:
      'Pride and shame travel together: the person who inflates themselves is setting up their own embarrassment. Humility, on the other hand, keeps company with wisdom. Humble people ask questions, admit what they do not know and learn from others, so they end up wiser. It is the colleague who says "I\'m not sure, let me check" who rarely ends up publicly wrong.',
    practice:
      'In a conversation today, say "I don\'t know" or "I was wrong" when it is true, instead of bluffing.',
    prompts: {
      understand: 'How does humility lead to wisdom in practical terms?',
      reflect: 'When did pride last lead you into an embarrassing moment?',
      act: 'Where could you choose to ask a question rather than pretend to know the answer?',
    },
  },
  {
    id: 'prov-12-1',
    book: 'Proverbs',
    chapter: 12,
    verseStart: 1,
    topics: ['discipline', 'wisdom', 'humility'],
    meaning:
      'This proverb is blunt: if you want to grow, you have to welcome correction. Hating to be told you are wrong is not a personality quirk; the proverb calls it "stupid" — the Hebrew suggests something almost animal-like, unable to learn. Feedback stings, but it is one of the fastest routes to knowledge. People who love learning learn to love being corrected.',
    practice:
      'The next time someone corrects you today, thank them before you explain or defend anything.',
    prompts: {
      understand: 'Why does the proverb link loving correction with loving knowledge?',
      reflect: 'How do you usually react when you are corrected? What happens inside you?',
      act: 'Who could you invite to give you honest correction in one area of your life?',
    },
  },
  {
    id: 'prov-12-15',
    book: 'Proverbs',
    chapter: 12,
    verseStart: 15,
    topics: ['decisions', 'humility', 'wisdom'],
    meaning:
      'Fools are convinced their own way is right; they do not see the need for anyone else\'s input. Wise people listen to advice. The difference is not how clever someone is, but whether they are open. Everyone feels right from the inside. That is exactly why outside perspective matters — it shows us what we cannot see from where we are standing.',
    practice:
      'Before finalising a plan this week, share it with someone whose judgement you trust and genuinely ask what they would change.',
    prompts: {
      understand: 'Why is "right in his own eyes" such a dangerous position to be in?',
      reflect: 'What decision are you making right now without asking anyone else?',
      act: 'Whose counsel do you tend to avoid, and why? Could you seek it this week?',
    },
  },
  {
    id: 'prov-12-18',
    book: 'Proverbs',
    chapter: 12,
    verseStart: 18,
    topics: ['speech', 'relationships'],
    meaning:
      'Careless words can wound like a sword — especially when spoken quickly, in frustration or as a "joke". But the same tongue, used wisely, can heal. The contrast is between speaking rashly and speaking with thought. A wise person considers the effect of their words before saying them, and can use them to repair damage rather than cause it.',
    practice:
      'If you have recently said something that hurt someone, go back today and acknowledge it plainly, without excuses.',
    prompts: {
      understand: 'What makes rash speech so damaging, even when it is not intended to hurt?',
      reflect: 'Have your words recently wounded or healed someone close to you?',
      act: 'What is one healing word you could say to someone this week?',
    },
  },
  {
    id: 'prov-12-25',
    book: 'Proverbs',
    chapter: 12,
    verseStart: 25,
    topics: ['emotions', 'speech', 'relationships'],
    meaning:
      'Anxiety is heavy — it weighs a person down from the inside. The proverb does not dismiss worry or tell people to simply stop feeling it. Instead, it observes that a kind word can lift that weight. Encouragement is not a small thing. A simple message saying "I\'m thinking of you" can genuinely lighten someone\'s day.',
    practice:
      'Think of someone carrying a heavy load at the moment and send them a short, kind message today.',
    prompts: {
      understand: 'What does this proverb suggest about the relationship between our inner lives and other people\'s words?',
      reflect: 'What anxiety is weighing on your heart right now? Who could you share it with?',
      act: 'Who around you might need a "good word" this week?',
    },
  },
  {
    id: 'prov-13-20',
    book: 'Proverbs',
    chapter: 13,
    verseStart: 20,
    topics: ['relationships', 'wisdom', 'decisions'],
    meaning:
      'You become like the people you spend time with. Walk with wise people and their wisdom rubs off; keep company with fools and you share in the damage. This is not about snobbery or abandoning people who struggle. It is a realistic observation about influence: our habits, attitudes and choices are shaped by the people we let closest.',
    practice:
      'Look at who you spend the most time with this week, and deliberately arrange a conversation with someone whose wisdom you admire.',
    prompts: {
      understand: 'Why might the proverb emphasise "walking with" people rather than simply knowing them?',
      reflect: 'Whose influence is shaping you most right now, for better or worse?',
      act: 'Is there a wise person you could intentionally spend more time with?',
    },
  },
  {
    id: 'prov-14-29',
    book: 'Proverbs',
    chapter: 14,
    verseStart: 29,
    topics: ['emotions', 'wisdom'],
    meaning:
      'Being slow to anger is a sign of deep understanding — of yourself, other people and situations. A quick temper puts foolishness on display for everyone to see. The proverb does not say anger is always wrong; it says that a wise person takes time before acting on it. That pause is where understanding has room to work.',
    practice:
      'When you feel irritation rise today, take three slow breaths before you speak or type anything.',
    prompts: {
      understand: 'What kind of "understanding" makes someone slow to anger?',
      reflect: 'What situations most often trigger a quick temper in you?',
      act: 'What practical pause could you build in before reacting this week?',
    },
  },
  {
    id: 'prov-14-30',
    book: 'Proverbs',
    chapter: 14,
    verseStart: 30,
    topics: ['emotions'],
    meaning:
      'A peaceful heart brings life to the whole person, but envy eats away at you from the inside, like decay in the bones. Envy promises that getting what someone else has will make you happy, but it mostly makes you miserable while you wait. The proverb treats inner peace and physical wellbeing as connected — what goes on inside affects everything.',
    practice:
      'When you notice envy today — scrolling, in conversation, at work — name one specific thing you are grateful for instead.',
    prompts: {
      understand: 'Why is envy described as rotting the bones — something deep and hidden?',
      reflect: 'Who or what do you find yourself envying at the moment?',
      act: 'What practice could cultivate a "heart at peace" in you this week?',
    },
  },
  {
    id: 'prov-15-22',
    book: 'Proverbs',
    chapter: 15,
    verseStart: 22,
    topics: ['decisions', 'wisdom', 'work'],
    meaning:
      'Plans made alone often fail, but plans that have been tested by several wise advisers tend to succeed. Other people notice risks you missed and options you did not consider. This is not about decision-by-committee; you still decide. It is about humility in the planning stage. Big decisions — a move, a job, a purchase — benefit from more than one perspective.',
    practice:
      'Take one plan you are working on and ask two different people for their honest input before acting on it.',
    prompts: {
      understand: 'Why do plans fail "where there is no counsel"?',
      reflect: 'What plan are you currently making mostly on your own?',
      act: 'Who are two people you could ask for counsel, and what would you ask them?',
    },
  },
  {
    id: 'prov-16-3',
    book: 'Proverbs',
    chapter: 16,
    verseStart: 3,
    topics: ['faith', 'work', 'decisions'],
    meaning:
      'The word "commit" here literally means "roll" — as if rolling a heavy load onto someone stronger. Hand your work over to God. This is not a formula for getting whatever you want. When your work is genuinely offered to God, your plans themselves tend to be shaped and steadied by that trust, and you are freed from carrying the whole weight alone.',
    practice:
      'Before you start your main task today, take a moment to consciously hand it over — the outcome, the pressure and the worry.',
    prompts: {
      understand: 'What is the difference between committing your work to God and asking God to bless your plans?',
      reflect: 'What work are you carrying as though everything depends on you?',
      act: 'What would it look like to "roll" one specific burden onto God this week?',
    },
  },
  {
    id: 'prov-16-9',
    book: 'Proverbs',
    chapter: 16,
    verseStart: 9,
    topics: ['faith', 'decisions', 'humility'],
    meaning:
      'We make plans — and we should. But God is the one who ultimately guides each step. The proverb holds two truths together: human responsibility to plan, and divine direction of how things actually unfold. It frees us from both laziness ("why bother planning?") and anxiety ("everything depends on me"). Plans are held with open hands.',
    practice:
      'When something today does not go to plan, pause before frustration sets in and ask what this unexpected step might be teaching you.',
    prompts: {
      understand: 'How does this proverb balance human planning with God\'s direction?',
      reflect: 'Where are you holding your plans too tightly at the moment?',
      act: 'How could you plan carefully this week while holding the outcome more loosely?',
    },
  },
  {
    id: 'prov-16-32',
    book: 'Proverbs',
    chapter: 16,
    verseStart: 32,
    topics: ['emotions', 'discipline'],
    meaning:
      'Self-control is a greater achievement than military victory. In the ancient world, capturing a city was the height of power and glory. The proverb says that ruling your own spirit — your temper, impulses and reactions — is greater still. It is harder to conquer yourself than to conquer others, and it is a quieter, more lasting kind of strength.',
    practice:
      'Identify one impulse you usually give in to (a sharp reply, a purchase, a snack, a scroll) and practise saying no to it once today.',
    prompts: {
      understand: 'Why might ruling your own spirit be harder than taking a city?',
      reflect: 'Where in your life does your "spirit" currently rule you, rather than the other way round?',
      act: 'What is one small act of self-mastery you could practise daily this week?',
    },
  },
  {
    id: 'prov-17-17',
    book: 'Proverbs',
    chapter: 17,
    verseStart: 17,
    topics: ['relationships'],
    meaning:
      'A true friend\'s love does not depend on circumstances — it holds steady in good times and bad. The second line adds that family, a "brother", is especially there for times of trouble. Together they describe the kind of loyalty that shows up when life gets hard, not just when it is fun. You find out who your real friends are in a crisis.',
    practice:
      'Reach out today to someone you know is going through a hard season, and offer something concrete — a meal, a call, your time.',
    prompts: {
      understand: 'What distinguishes love "at all times" from friendship of convenience?',
      reflect: 'Who has been a friend to you "for adversity"? How have you shown up for others?',
      act: 'Who needs you to be a steady friend right now, and what could you do?',
    },
  },
  {
    id: 'prov-17-22',
    book: 'Proverbs',
    chapter: 17,
    verseStart: 22,
    topics: ['emotions'],
    meaning:
      'Joy is good medicine: a cheerful heart brings health and resilience. A crushed spirit, by contrast, leaves a person dry and depleted — the "bones" stand for a person\'s inner strength. This is not a demand to always be happy, but an observation that our emotional state matters for our whole wellbeing, and that laughter and gladness are worth cultivating rather than dismissing.',
    practice:
      'Do one thing today purely because it brings you or someone else genuine joy — and give yourself permission to enjoy it.',
    prompts: {
      understand: 'What does this proverb suggest about the link between emotional and physical health?',
      reflect: 'Is your spirit currently cheerful, crushed or somewhere in between? Why?',
      act: 'What is one source of healthy joy you could make more room for this week?',
    },
  },
  {
    id: 'prov-18-13',
    book: 'Proverbs',
    chapter: 18,
    verseStart: 13,
    topics: ['speech', 'relationships', 'humility'],
    meaning:
      'Answering before you have actually heard someone out is foolish and ends up embarrassing you. We often listen just long enough to start forming our reply, then stop listening. The proverb calls that folly: you respond to what you assumed they meant, not what they said. Real listening means waiting until you understand before you speak.',
    practice:
      'In your next important conversation, summarise what the other person said back to them before giving your own view.',
    prompts: {
      understand: 'Why is answering before listening described as both folly and shame?',
      reflect: 'With whom do you most often start forming your reply before they have finished?',
      act: 'What would help you listen fully in your conversations this week?',
    },
  },
  {
    id: 'prov-19-11',
    book: 'Proverbs',
    chapter: 19,
    verseStart: 11,
    topics: ['relationships', 'emotions', 'humility'],
    meaning:
      'Good sense makes a person patient, and there is real honour in letting an offence go. Not every slight needs a response. Overlooking something is not the same as pretending it did not happen or excusing serious wrong; it is choosing not to hold minor grievances against people. Wise people pick their battles and let many small things pass.',
    practice:
      'Choose one small irritation or slight from someone today and consciously decide to let it go, without mentioning it.',
    prompts: {
      understand: 'Why would overlooking an offence be described as someone\'s "glory"?',
      reflect: 'Is there a minor grievance you are still holding onto?',
      act: 'What is the difference between overlooking an offence and avoiding a necessary conversation in your situation?',
    },
  },
  {
    id: 'prov-20-5',
    book: 'Proverbs',
    chapter: 20,
    verseStart: 5,
    topics: ['relationships', 'wisdom', 'speech'],
    meaning:
      'A person\'s real thoughts and intentions are often hidden deep inside, like water at the bottom of a well. A person of understanding knows how to draw them out — through patient questions, attentive listening and creating a safe space. This is the skill of a good friend, counsellor or leader: helping people discover and express what they really think.',
    practice:
      'In a conversation today, ask a follow-up question — "What makes you say that?" or "How did that feel?" — instead of moving on.',
    prompts: {
      understand: 'What does the image of deep water suggest about people\'s inner lives?',
      reflect: 'Who in your life might have more going on beneath the surface than you know?',
      act: 'What questions could you ask this week to help someone share what is really on their heart?',
    },
  },
  {
    id: 'prov-22-1',
    book: 'Proverbs',
    chapter: 22,
    verseStart: 1,
    topics: ['integrity', 'money'],
    meaning:
      'A good reputation — being known as trustworthy, honest and kind — is worth more than great wealth. Money can be lost and regained, but a damaged name is hard to repair. "Loving favour" means being held in genuine goodwill by others. In a culture that often measures success by income, the proverb insists character is the more valuable asset.',
    practice:
      'Keep one promise today exactly as you made it, even if it costs you some convenience.',
    prompts: {
      understand: 'Why might a good name be more valuable than riches?',
      reflect: 'What are you known for among the people around you?',
      act: 'Is there a decision ahead where you might be tempted to trade character for gain?',
    },
  },
  {
    id: 'prov-22-6',
    book: 'Proverbs',
    chapter: 22,
    verseStart: 6,
    topics: ['relationships', 'discipline', 'wisdom'],
    meaning:
      'Early training shapes a person for life. The habits, values and direction given to a child tend to stay with them. This is a proverb, not an iron-clad promise — it describes a general pattern, and the book elsewhere recognises that people make their own choices. Some read "the way he should go" as fitting training to each child\'s character, which the Hebrew can allow.',
    practice:
      'Take one intentional moment today to pass on something you value — a skill, a habit or a story — to a younger person in your life.',
    prompts: {
      understand: 'Why does Proverbs present this as a general pattern rather than a guarantee?',
      reflect: 'Which habits and values from your own upbringing are still shaping you today?',
      act: 'Who are you influencing — children, younger colleagues, friends — and what are you passing on?',
    },
    context:
      'Readers should not treat this verse as blame for parents of children who later go their own way; proverbs express typical outcomes, not guarantees.',
  },
  {
    id: 'prov-22-7',
    book: 'Proverbs',
    chapter: 22,
    verseStart: 7,
    topics: ['money', 'decisions'],
    meaning:
      'This proverb simply describes how things work: those with money hold power over those without, and borrowing places you under the lender\'s control. It is a sober observation about debt, not an endorsement. Debt limits your freedom — your future income is already committed. The wisdom is to treat borrowing seriously and to be wary of anything that makes you "servant" to it.',
    practice:
      'Before one purchase today or this week, ask whether you would still buy it if you had to pay the full amount in cash right now.',
    prompts: {
      understand: 'What does the proverb mean by describing the borrower as a "servant"?',
      reflect: 'Where do you feel the weight of what you owe — financially or otherwise?',
      act: 'What is one step you could take toward greater financial freedom this month?',
    },
  },
  {
    id: 'prov-25-11',
    book: 'Proverbs',
    chapter: 25,
    verseStart: 11,
    topics: ['speech'],
    meaning:
      'The right word at the right time is a thing of beauty, like a finely crafted piece of golden fruit set in silver. The proverb highlights timing and fit: the same words can land beautifully or badly depending on the moment. Wise speech is not just about what is true, but about saying it when, and how, it can be received.',
    practice:
      'Before you say something important today, ask yourself whether now is the right moment and setting for it.',
    prompts: {
      understand: 'Why does the proverb compare well-timed words to a piece of fine art?',
      reflect: 'When has someone said exactly the right thing to you at exactly the right time?',
      act: 'Is there something you need to say that would be better at a different time or in a different way?',
    },
    context:
      'The image is probably of ornamental gold work in a silver setting. The exact object is uncertain, but the sense of beauty and fitness is clear.',
  },
  {
    id: 'prov-25-28',
    book: 'Proverbs',
    chapter: 25,
    verseStart: 28,
    topics: ['discipline', 'emotions'],
    meaning:
      'In the ancient world, a city\'s walls were its protection. Without them, it was open to any attacker. A person without self-control is in the same position — exposed to every impulse, temptation and passing mood. Self-control is not a cage; it is a wall that keeps what matters safe.',
    practice:
      'Name one area where your "walls" are down — spending, eating, screen time, temper — and set one simple limit for today.',
    prompts: {
      understand: 'How does the image of a broken-down city help explain the value of self-control?',
      reflect: 'Where in your life do you feel most exposed or vulnerable to your impulses?',
      act: 'What is one "wall" you could rebuild this week?',
    },
  },
  {
    id: 'prov-26-4-5',
    book: 'Proverbs',
    chapter: 26,
    verseStart: 4,
    verseEnd: 5,
    topics: ['wisdom', 'speech', 'decisions'],
    meaning:
      'These two verses deliberately seem to contradict each other: don\'t answer a fool, then do answer a fool. The point is that wisdom is not a rulebook. Sometimes engaging with a foolish argument drags you down to its level; sometimes staying silent lets a falsehood stand unchallenged. Wisdom is knowing which situation you are in. Think of an online argument: sometimes the wise move is to scroll past, sometimes to say something.',
    practice:
      'The next time someone says something foolish or provocative, pause and ask, "Will responding help, or will it just drag me in?" — then choose deliberately.',
    prompts: {
      understand: 'Why might Proverbs place two opposite instructions side by side?',
      reflect: 'Is there a conversation or situation where you are unsure whether to respond or stay silent?',
      act: 'What question could help you decide when to engage and when to let something go?',
    },
    context:
      'Placing these sayings next to each other is intentional. Ancient readers understood proverbs as tools that require judgement to apply, not universal laws.',
  },
  {
    id: 'prov-27-1',
    book: 'Proverbs',
    chapter: 27,
    verseStart: 1,
    topics: ['humility', 'decisions'],
    meaning:
      'Don\'t brag about what you will do tomorrow, because you do not know what tomorrow holds. This is not a warning against planning, but against arrogant certainty about the future. Life is unpredictable. Holding plans humbly keeps us grounded, grateful for today and less crushed when things change.',
    practice:
      'Replace one confident "I will…" statement today with "I hope to…" or "I plan to…", and notice how it shifts your attitude.',
    prompts: {
      understand: 'What is the difference between planning for tomorrow and boasting about it?',
      reflect: 'What future plans are you treating as certain?',
      act: 'How could you live more fully in today while still preparing for tomorrow?',
    },
  },
  {
    id: 'prov-27-6',
    book: 'Proverbs',
    chapter: 27,
    verseStart: 6,
    topics: ['relationships', 'integrity', 'speech'],
    meaning:
      'Honest criticism from a friend can hurt, but it is given in faithfulness — it comes from someone who genuinely wants your good. An enemy may be full of flattery and affection on the surface, but it means nothing. Painful honesty from someone who loves you is worth more than lavish praise from someone who does not.',
    practice:
      'If a friend has recently told you something hard, thank them for it today — even if you are still processing it.',
    prompts: {
      understand: 'Why are a friend\'s wounds called "faithful"?',
      reflect: 'Do you surround yourself with honest friends or with flatterers?',
      act: 'Is there someone who needs you to be honest with them, lovingly, this week?',
    },
  },
  {
    id: 'prov-28-13',
    book: 'Proverbs',
    chapter: 28,
    verseStart: 13,
    topics: ['integrity', 'humility', 'faith'],
    meaning:
      'Hiding wrongdoing does not lead anywhere good — secrets tend to fester. But confessing and turning away from what we have done wrong opens the door to mercy. The proverb asks for two things: admitting it and leaving it behind. It is the difference between a cover-up and a genuine fresh start.',
    practice:
      'If there is something you have been hiding — from God, from someone close or from yourself — bring it into the open today in one honest step.',
    prompts: {
      understand: 'Why does the proverb require both confessing and renouncing, not just one?',
      reflect: 'Is there anything in your life you are currently concealing?',
      act: 'Who could you trust with an honest confession, and what would turning away from it look like?',
    },
  },
  {
    id: 'prov-29-25',
    book: 'Proverbs',
    chapter: 29,
    verseStart: 25,
    topics: ['faith', 'relationships', 'emotions'],
    meaning:
      'Being controlled by what other people think is a trap. It makes us say yes when we mean no, hide our convictions and live for approval. The alternative is trusting God, which brings a security that doesn\'t depend on anyone\'s opinion. When your worth is anchored somewhere stable, you can be honest and kind without being held hostage by others.',
    practice:
      'Notice one moment today where you are tempted to say or do something just to please someone, and choose honesty instead.',
    prompts: {
      understand: 'Why does the proverb describe the fear of man as a "snare"?',
      reflect: 'Whose approval do you most crave at the moment?',
      act: 'What is one decision this week you could make based on conviction rather than approval?',
    },
  },
  {
    id: 'prov-30-8-9',
    book: 'Proverbs',
    chapter: 30,
    verseStart: 8,
    verseEnd: 9,
    topics: ['money', 'faith', 'integrity'],
    meaning:
      'This is a prayer for "enough": neither poverty nor riches. Too much can make us self-sufficient and forget God; too little can push us toward desperate choices. The writer asks to be kept honest and to have what is needed. It is a strikingly modern prayer about contentment, recognising that both extremes carry their own temptations.',
    practice:
      'Before a purchase or financial decision today, ask yourself: "Do I need this, or am I chasing more than enough?"',
    prompts: {
      understand: 'Why might both poverty and riches be dangerous to someone\'s character and faith?',
      reflect: 'What does "enough" look like for you right now?',
      act: 'What is one way you could practise contentment this week?',
    },
    context:
      'Proverbs 30 is attributed to Agur son of Jakeh (30:1). Verses 7–9 form a short prayer with two requests: honesty and enough.',
  },
  {
    id: 'prov-31-8-9',
    book: 'Proverbs',
    chapter: 31,
    verseStart: 8,
    verseEnd: 9,
    topics: ['justice', 'speech'],
    meaning:
      'Speak up for people who cannot speak for themselves and defend the rights of the poor and vulnerable. These words were originally addressed to a king, reminding him that power exists to protect the weak, not to serve itself. Today it applies to anyone with influence — at work, in a community, online. Your voice is a tool for justice.',
    practice:
      'Identify one person or group who is being overlooked in a space you are part of, and use your voice on their behalf today.',
    prompts: {
      understand: 'Why does the proverb connect power and influence with responsibility to the vulnerable?',
      reflect: 'Where do you have influence, and who around you lacks a voice?',
      act: 'What is one concrete way you could speak up for someone this week?',
    },
    context:
      'Proverbs 31:1–9 records advice that King Lemuel\'s mother gave him about ruling well. The closing quotation mark in verse 9 ends her words.',
  },
  {
    id: 'prov-3-27',
    book: 'Proverbs',
    chapter: 3,
    verseStart: 27,
    topics: ['justice', 'integrity', 'relationships'],
    meaning:
      'If you are able to do good for someone who deserves it, do it — don\'t hold back. This covers paying what you owe, but also kindness, help and recognition that people are due. The phrase "when it is in the power of your hand" is key: the question is not whether you could do something huge, but whether you will do what is within reach right now.',
    practice:
      'Do one good thing today that is within your power and that you have been putting off — pay a bill, return a favour, give credit where it is due.',
    prompts: {
      understand: 'What kinds of "good" might people be due, beyond money?',
      reflect: 'Is there good you have been withholding from someone, even unintentionally?',
      act: 'What is within your power to do for someone this week?',
    },
  },
  {
    id: 'prov-13-11',
    book: 'Proverbs',
    chapter: 13,
    verseStart: 11,
    topics: ['money', 'work', 'integrity'],
    meaning:
      'Money gained through shortcuts or dishonesty tends to slip away, while wealth built gradually, "by hand", tends to grow. The contrast is between quick gain and patient effort. Get-rich-quick schemes promise fast results but rarely last; steady saving and honest work compound over time, like small deposits that slowly add up.',
    practice:
      'Set aside a small amount today — money, time or effort — toward a long-term goal, even if it feels insignificant.',
    prompts: {
      understand: 'Why does quickly gained wealth tend to dwindle?',
      reflect: 'Are you drawn to shortcuts anywhere in your finances or work?',
      act: 'What is one small, steady habit you could begin that would compound over time?',
    },
  },
  {
    id: 'prov-19-2',
    book: 'Proverbs',
    chapter: 19,
    verseStart: 2,
    topics: ['decisions', 'wisdom'],
    meaning:
      'Enthusiasm without knowledge is not a good thing, and rushing ahead means missing the way. Passion is valuable, but on its own it can lead you confidently in the wrong direction. The proverb pairs zeal with understanding and haste with error. Taking time to learn before acting is not a lack of commitment; it is wisdom.',
    practice:
      'Before you act on something you are excited about today, spend ten minutes learning more about it first.',
    prompts: {
      understand: 'Why might zeal without knowledge be dangerous rather than simply ineffective?',
      reflect: 'Where are you rushing ahead without enough understanding?',
      act: 'What would it look like to slow down and learn before acting on one decision this week?',
    },
  },
  {
    id: 'prov-20-22',
    book: 'Proverbs',
    chapter: 20,
    verseStart: 22,
    topics: ['justice', 'faith', 'emotions'],
    meaning:
      'Don\'t make it your mission to pay people back for the wrong they have done to you. Instead, wait for God to bring justice and rescue. This is not passivity in the face of evil; it is refusing to become the avenger. Revenge tends to escalate harm and keeps you tied to the person who hurt you. Trusting God with justice sets you free.',
    practice:
      'If you are nursing a desire to get back at someone, write down the wrong done to you and consciously hand it over to God.',
    prompts: {
      understand: 'Why might the proverb tell us to "wait" rather than act when we have been wronged?',
      reflect: 'Is there someone you want to see "pay back" for something they did?',
      act: 'What would it look like to release the desire for revenge this week?',
    },
  },
  {
    id: 'prov-23-4-5',
    book: 'Proverbs',
    chapter: 23,
    verseStart: 4,
    verseEnd: 5,
    topics: ['money', 'work', 'wisdom'],
    meaning:
      'Don\'t exhaust yourself chasing wealth. Riches are fragile — in a vivid image, they sprout wings and fly away like an eagle. This is not a rejection of work or financial responsibility, but a warning against making money your driving goal. What you wear yourself out to gain can vanish, so invest your energy in things that last.',
    practice:
      'Notice one way you are overworking or overspending energy chasing more today, and choose rest or relationship instead.',
    prompts: {
      understand: 'What does the image of wealth flying away like an eagle suggest?',
      reflect: 'Where are you wearing yourself out in pursuit of more?',
      act: 'What would "showing restraint" look like in your work or spending this week?',
    },
  },
  {
    id: 'prov-29-11',
    book: 'Proverbs',
    chapter: 29,
    verseStart: 11,
    topics: ['emotions', 'speech', 'discipline'],
    meaning:
      'A fool lets all their anger out, immediately and completely. A wise person holds it back and brings it under control. The proverb is not saying anger must be denied; it is saying it should not be in charge. Venting everything can feel good in the moment, but it often causes damage that is hard to undo.',
    practice:
      'When you feel the urge to vent today, write it down first in private, then decide what, if anything, needs to be said.',
    prompts: {
      understand: 'What is the difference between expressing anger and venting all of it?',
      reflect: 'When did you last "vent all of your anger"? What happened as a result?',
      act: 'What is one healthy way to process anger you could practise this week?',
    },
  },
];
