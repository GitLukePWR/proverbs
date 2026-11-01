import type { Scenario } from '../domain/types';

/**
 * Wisdom in Action scenarios.
 *
 * - Each scenario links to an existing study by `proverbId`; Scripture text is
 *   always resolved from the study library, never written here.
 * - All wording here is original Wize commentary.
 * - Feedback explains appeal, consequences and reasoning. It never labels an
 *   option "right" or "wrong", and some scenarios (alignedOptionId: null)
 *   genuinely depend on context.
 * - The most aligned option is deliberately placed in different positions.
 * - IDs are permanent: progress records reference them. Append new scenarios
 *   to the END of the list.
 */
export const SCENARIOS: Scenario[] = [
  {
    id: 'sc-unfair-criticism',
    proverbId: 'prov-15-1',
    topics: ['speech', 'work', 'emotions'],
    title: 'Criticised in the meeting',
    situation:
      'A colleague criticises your work during a team meeting. You believe the criticism is unfair, and you can feel yourself getting defensive as everyone looks your way.',
    question: 'How do you respond?',
    options: [
      {
        id: 'a',
        label: 'Defend yourself immediately.',
        detail: 'Explain why their criticism is unfair and point out their own mistakes in return.',
        feedback:
          'This is the instinctive response, and it can feel like standing up for yourself. But answering heat with heat usually turns a disagreement about work into a contest between people. Others in the room remember the tension more than the facts, and your colleague is now less likely to listen. You may win the moment and lose the working relationship.',
      },
      {
        id: 'b',
        label: 'Stay composed and ask for specifics.',
        detail: 'Listen, ask what exactly needs improving, and calmly correct anything inaccurate.',
        feedback:
          'This takes more self-control, but it lowers the temperature and moves the conversation onto facts. If part of the criticism is fair, you learn something; if it is not, specific questions often reveal that without you having to attack. Staying calm is not the same as agreeing: you can still say, "I see that differently, and here is why."',
      },
      {
        id: 'c',
        label: 'Say nothing, but hold onto it.',
        detail: 'Avoid confrontation in the meeting, even though you stay angry afterwards.',
        feedback:
          'Silence avoids a scene, and sometimes waiting is wise. The risk is that nothing gets resolved: inaccurate criticism stands unchallenged, and your frustration leaks out later in other ways. If you choose not to respond in the room, make it a deliberate pause and follow up privately once you are calm, rather than simply swallowing it.',
      },
    ],
    alignedOptionId: 'b',
    wiserPath:
      'A gentle answer is not a passive one. The wiser path is to slow your response, ask what they mean, acknowledge anything that is fair, and calmly correct what is not, either in the room or in a follow-up conversation. That keeps the focus on the work and leaves the door open for the relationship.',
    connection:
      'Proverbs 15:1 observes that the tone of a reply often decides where a conflict goes next. A gentle answer can defuse anger without giving up the truth.',
    followUp: 'Think of a recent disagreement. How might a different first response have changed the conversation?',
  },
  {
    id: 'sc-mistake-nobody-saw',
    proverbId: 'prov-28-13',
    topics: ['integrity', 'work', 'humility'],
    title: 'The error nobody noticed',
    situation:
      'You realise a report you sent to a client last week contained a pricing error in your company’s favour. No one has noticed, and correcting it now will be awkward and cost your team money.',
    question: 'What do you do?',
    options: [
      {
        id: 'a',
        label: 'Quietly fix it in the next version.',
        detail: 'Correct the figure going forward without drawing attention to the original mistake.',
        feedback:
          'This feels like a reasonable compromise: the error stops, and nobody is embarrassed. But the client has already acted on the wrong number, and the decision to stay quiet is now yours, not an accident. If it surfaces later, the question will not be "how did this happen?" but "why didn’t you tell us?", which is far harder to recover from.',
      },
      {
        id: 'b',
        label: 'Leave it. It’s their job to check.',
        detail: 'The client agreed to the figure, so it isn’t your responsibility to reopen it.',
        feedback:
          'It is tempting to treat this as the client’s problem, especially when correcting it costs you. In the short term nothing happens. In the long term you carry a small secret that shapes how you deal with this client, and it quietly trains you to see honesty as optional when it is expensive. Trust, once found to be misplaced, is costly to rebuild.',
      },
      {
        id: 'c',
        label: 'Tell your manager and the client.',
        detail: 'Explain the error plainly, correct it, and suggest how to prevent it next time.',
        feedback:
          'This is uncomfortable and may cost money or a little pride. But owning the mistake early usually earns more trust than it loses: the client learns that your figures can be relied on because you correct them even when no one is looking. Handled plainly, without excessive self-criticism, it becomes evidence of integrity rather than incompetence.',
      },
    ],
    alignedOptionId: 'c',
    wiserPath:
      'Bring it into the open promptly and plainly: name the error, correct it, and suggest a safeguard. Involve your manager so you are not deciding alone. Confession here is not about punishing yourself; it is about refusing to let a mistake turn into a cover-up.',
    connection:
      'Proverbs 28:13 contrasts concealing wrongdoing with confessing and turning from it. Hiding tends to compound a problem; honesty opens the way to a fresh start.',
    followUp: 'Is there a small mistake you have been hoping no one will notice? What would owning it look like?',
  },
  {
    id: 'sc-pay-later',
    proverbId: 'prov-22-7',
    topics: ['money', 'decisions', 'discipline'],
    title: 'Buy now, pay later',
    situation:
      'You find a jacket you love at 30% off, today only. You can’t really afford it this month, but the checkout offers to split the cost into four interest-free payments.',
    question: 'What do you do?',
    options: [
      {
        id: 'a',
        label: 'Split the payments. It’s interest-free.',
        detail: 'The discount is real, and four small payments feel manageable.',
        feedback:
          'This feels sensible: no interest and a genuine saving. But it commits next month’s income to this month’s want, and small instalments are easy to stack across several purchases. If money gets tight, late fees and stress follow. The jacket may be worth it; the habit of spending money you do not yet have is what quietly builds the borrower’s burden.',
      },
      {
        id: 'b',
        label: 'Wait 48 hours before deciding.',
        detail: 'Leave it in the basket, and buy it later only if you could pay in full.',
        feedback:
          'You might lose the discount, and that can sting. But a short pause separates genuine wants from the pressure of a deadline designed to rush you. If you still want it and can pay outright, you buy it freely; if not, you have kept your future income uncommitted. Either way, you are the one deciding, not the countdown timer.',
      },
      {
        id: 'c',
        label: 'Skip it, and feel bad about missing out.',
        detail: 'Close the tab immediately, even though you keep thinking about it.',
        feedback:
          'Walking away protects your budget, which is a real win. But if self-denial comes with resentment, it often rebounds into a bigger impulse purchase later. Restraint works best when it is chosen for a reason you value, such as freedom from debt or saving for something that matters, rather than as a grim act of willpower.',
      },
    ],
    alignedOptionId: 'b',
    wiserPath:
      'Pause, then decide based on what you can pay for now. Discounts and "interest-free" offers are tools, not traps, but they are built to make borrowing feel effortless. Treat any purchase you cannot pay in full as borrowing, and ask whether it is worth tying up your future self for.',
    connection:
      'Proverbs 22:7 soberly notes that borrowing places you under the lender’s control. Even small, friendly-looking debts limit tomorrow’s freedom.',
    followUp: 'What spending decision this month would you make differently if you treated it as borrowing?',
  },
  {
    id: 'sc-office-gossip',
    proverbId: 'prov-18-21',
    topics: ['speech', 'relationships', 'work'],
    title: 'The juicy rumour',
    situation:
      'At lunch, a colleague leans in and starts sharing a rumour about why another team member was moved off a project. Everyone at the table is listening.',
    question: 'What do you do?',
    options: [
      {
        id: 'a',
        label: 'Listen, but don’t add anything.',
        detail: 'You stay quiet, so you’re not really taking part.',
        feedback:
          'This feels neutral, and it avoids an awkward moment. But listening with interest still gives the story an audience, and silence can read as agreement. You also now carry information you cannot unknow. It is better than spreading it, yet it leaves the rumour, and the absent person, undefended.',
      },
      {
        id: 'b',
        label: 'Gently change the subject.',
        detail: 'Say something like, "I’d rather hear it from them," then move the conversation on.',
        feedback:
          'This takes a little courage and may cost you a moment of social ease. But it quietly withdraws the audience without shaming anyone, and it signals that you are someone people can trust not to talk about them. Over time, that reputation is worth far more than being first to hear the news.',
      },
      {
        id: 'c',
        label: 'Join in. It’s just harmless chat.',
        detail: 'Share what you’ve heard too; everyone does it.',
        feedback:
          'Gossip bonds people quickly, which is exactly why it is tempting. In the short term it feels like belonging. In the long term, words about an absent colleague can damage their reputation in ways you cannot undo, and listeners quietly wonder what you say about them when they are not there.',
      },
    ],
    alignedOptionId: 'b',
    wiserPath:
      'Decline to feed the story without preaching. A light redirection, or a simple "I don’t think that’s ours to share," protects the absent person and lowers the temperature. If you are genuinely concerned for them, speak to them directly rather than about them.',
    connection:
      'Proverbs 18:21 says death and life are in the power of the tongue. What we say about others plants something that grows, for them and for us.',
    followUp: 'When did words spoken about you, kind or unkind, stay with you? What did that teach you?',
  },
  {
    id: 'sc-job-offer',
    proverbId: 'prov-15-22',
    topics: ['decisions', 'work', 'wisdom'],
    title: 'The offer with a deadline',
    situation:
      'You’ve been offered a job with better pay in another city. It would mean a big change for you and the people close to you. They want an answer by Friday.',
    question: 'How do you decide?',
    options: [
      {
        id: 'a',
        label: 'Trust your gut and decide tonight.',
        detail: 'You know yourself best; overthinking will only confuse you.',
        feedback:
          'Intuition matters, and endless deliberation can be paralysing. But big decisions made alone, under time pressure, often miss things: costs to others, questions you forgot to ask, or a better counter-offer. Your gut is one voice worth hearing, not the only one.',
      },
      {
        id: 'b',
        label: 'Talk it through with a few wise people.',
        detail: 'Speak to those affected and someone with relevant experience before Friday.',
        feedback:
          'This takes time you may feel you do not have, and other people’s views can be uncomfortable. But a few honest conversations often reveal blind spots, and asking those affected treats them with respect. You still make the decision; you simply make it with more light.',
      },
      {
        id: 'c',
        label: 'Ask for more time, and keep researching.',
        detail: 'Request an extension and gather as much information as possible.',
        feedback:
          'Asking for a few more days is often reasonable, and many employers will agree. The risk is using research to avoid deciding at all, or losing the offer by stalling. More information helps up to a point; beyond that, what you need is judgement and counsel, not more data.',
      },
    ],
    alignedOptionId: 'b',
    wiserPath:
      'Seek counsel within the time you have. Talk honestly with those affected and one or two people who have made similar moves, list what you would gain and lose, and ask for a short extension only if it serves a clear purpose. Then decide and commit.',
    connection:
      'Proverbs 15:22 observes that plans fail without counsel but are established with many advisers. Wise input does not remove the decision; it strengthens it.',
    followUp: 'What decision are you facing where another perspective might help? Who could you ask?',
  },
  {
    id: 'sc-heated-message',
    proverbId: 'prov-29-11',
    topics: ['emotions', 'speech', 'discipline'],
    title: 'The message you want to send',
    situation:
      'A family member sends a message that feels dismissive of something important to you. You’re furious, and you’ve already typed a long reply telling them exactly what you think.',
    question: 'What do you do with it?',
    options: [
      {
        id: 'a',
        label: 'Delete it and pretend it’s fine.',
        detail: 'Keeping the peace matters more than how you feel.',
        feedback:
          'This avoids an immediate fight and can come from a good place. But pretending you are fine does not make the hurt go away; it often returns as distance or resentment. Restraint is wise, yet the issue may still need addressing, just not in the heat of the moment.',
      },
      {
        id: 'b',
        label: 'Send it. They need to hear it.',
        detail: 'You’re only being honest about how they made you feel.',
        feedback:
          'Saying everything at once can feel cleansing, and some of it may be true. But messages written in anger tend to wound more than they inform, and they cannot be unsent. The other person is likely to respond to your tone rather than your point, and a misunderstanding can harden into a rift.',
      },
      {
        id: 'c',
        label: 'Save it as a draft and revisit tomorrow.',
        detail: 'Let the anger settle, then decide what actually needs to be said.',
        feedback:
          'Waiting can feel unsatisfying when you want to be heard now. But writing the reply has already helped you name what hurts, and time lets you separate the core issue from the heat. Tomorrow you may send a shorter, clearer message, ask for a call, or realise you misread their tone.',
      },
    ],
    alignedOptionId: 'c',
    wiserPath:
      'Feel the anger, but do not let it hold the pen. Write privately if it helps, then wait. When you are calmer, say what matters plainly, ideally in conversation rather than text, and leave out what was only there to hurt.',
    connection:
      'Proverbs 29:11 contrasts venting all of one’s anger with bringing it under control. Anger is not denied; it is simply not put in charge.',
    followUp: 'When did you last say something in anger? What would a calmer version have sounded like?',
  },
  {
    id: 'sc-new-crowd',
    proverbId: 'prov-13-20',
    topics: ['relationships', 'decisions'],
    title: 'The new crowd',
    situation:
      'Since starting a new job, you’ve been spending your evenings with a fun group of colleagues. You’ve noticed you’re drinking more, spending more, and becoming more cynical about work.',
    question: 'What do you do?',
    options: [
      {
        id: 'a',
        label: 'Keep going. It’s just a phase.',
        detail: 'You’re enjoying yourself and it isn’t doing any real harm.',
        feedback:
          'It may well be a phase, and enjoying new friends is good. But the changes you have noticed are exactly how influence works: gradually and pleasantly. If you do nothing, the habits and attitudes of the group can become yours by default rather than by choice.',
      },
      {
        id: 'b',
        label: 'Cut them off completely.',
        detail: 'Stop going out with them and keep things strictly professional.',
        feedback:
          'This decisively removes the influence, and in some situations a clean break is necessary. But it can be an overcorrection: these people may be good company in other settings, and abruptly withdrawing can isolate you at work. The goal is to choose your influences, not to judge people.',
      },
      {
        id: 'c',
        label: 'Rebalance who you spend time with.',
        detail: 'Join them sometimes, set limits, and invest in friendships that build you up.',
        feedback:
          'This is less dramatic than cutting ties and asks more of you: deciding in advance what you will and will not do, and making time for people who sharpen you. It keeps the friendships while ensuring they do not set the direction of your life.',
      },
    ],
    alignedOptionId: 'c',
    wiserPath:
      'Notice the drift honestly, then choose your company deliberately. Spend regular time with people whose wisdom you admire, set clear limits in situations that pull you off course, and be the influence you would want others to be. A clean break is wise only if limits are not enough.',
    connection:
      'Proverbs 13:20 says that walking with the wise makes you wise. Whoever you keep closest slowly shapes your habits, attitudes and choices.',
    followUp: 'Whose influence is shaping you most right now? Is it moving you in a direction you want?',
  },
  {
    id: 'sc-launch-now',
    proverbId: 'prov-19-2',
    topics: ['decisions', 'work', 'wisdom'],
    title: 'Launch now or wait?',
    situation:
      'You’re excited about a side business idea and want to quit your job to pursue it full time. You haven’t tested it with real customers yet, but a friend says, "If you wait, you’ll never do it."',
    question: 'What do you do?',
    options: [
      {
        id: 'a',
        label: 'Quit and go all in.',
        detail: 'Passion and pressure will make you work harder.',
        feedback:
          'Boldness is attractive, and some ventures do need full commitment. But enthusiasm without evidence can lead you confidently in the wrong direction. If the idea needs changes, you will be learning them with no income and rising pressure, which tends to narrow your thinking rather than sharpen it.',
      },
      {
        id: 'b',
        label: 'Test it alongside your job first.',
        detail: 'Find a handful of paying customers before deciding to leave.',
        feedback:
          'This is slower and harder on your evenings, and it may feel less heroic. But it turns excitement into knowledge: you learn whether people will pay, what needs to change, and what it really demands of you. If it works, you leave with confidence; if not, you have lost little.',
      },
      {
        id: 'c',
        label: 'Drop the idea. It’s too risky.',
        detail: 'Stay safe; most new businesses fail anyway.',
        feedback:
          'Caution protects your stability, and that matters, especially if others depend on you. But dismissing the idea untested means deciding on fear rather than knowledge. You may never know whether it could have worked, and regret can weigh as heavily as failure.',
      },
    ],
    alignedOptionId: 'b',
    wiserPath:
      'Keep the zeal, add knowledge. Test the idea in small, real ways, set a clear signal for when you would commit fully, and seek advice from someone who has done it. Decisiveness is good when it rests on understanding, not on pressure or impatience.',
    connection:
      'Proverbs 19:2 warns that zeal without knowledge is not good and that haste misses the way. Passion is meant to be paired with understanding.',
    followUp: 'Where are you tempted to rush ahead, or to hold back out of fear? What would you need to know to decide well?',
  },
  {
    id: 'sc-the-promotion',
    proverbId: 'prov-16-18',
    topics: ['humility', 'work', 'decisions'],
    title: 'After the promotion',
    situation:
      'You’ve just been promoted after a string of successes. In your first planning meeting, a junior colleague questions your proposed approach in front of the team.',
    question: 'How do you handle it?',
    options: [
      {
        id: 'a',
        label: 'Ask them to explain their concern.',
        detail: 'Take the question seriously, even if you still think your plan is right.',
        feedback:
          'It can feel risky to let your authority be questioned so early. But genuinely listening shows the team that good ideas are welcome regardless of rank, and you may catch a flaw before it becomes expensive. If your plan holds up, explaining why builds confidence rather than undermining it.',
      },
      {
        id: 'b',
        label: 'Politely move on.',
        detail: 'Thank them, but keep to your plan; you were promoted for a reason.',
        feedback:
          'This keeps the meeting on track and avoids looking unsure. But it quietly tells the team that questions are not really welcome. Over time people stop raising concerns, and a leader who no longer hears dissent is far more likely to walk into avoidable mistakes.',
      },
      {
        id: 'c',
        label: 'Address it privately afterwards.',
        detail: 'Explain to them that challenging you publicly wasn’t appropriate.',
        feedback:
          'There can be a fair conversation to have about how concerns are raised. But if the main message is "don’t challenge me", it protects your image at the cost of the team’s honesty. Success can make us sensitive to questioning precisely when we most need it.',
      },
    ],
    alignedOptionId: 'a',
    wiserPath:
      'Treat success as a reason for more listening, not less. Invite the concern, weigh it honestly, and either adapt or explain your reasoning. Build in habits, such as asking "what am I missing?", that protect you from the blind spots that confidence creates.',
    connection:
      'Proverbs 16:18 observes that pride goes before destruction. The danger is not success itself, but the refusal to be questioned that it can breed.',
    followUp: 'Where might confidence be making you less open to being questioned?',
  },
  {
    id: 'sc-shared-credit',
    proverbId: 'prov-11-2',
    topics: ['humility', 'work', 'integrity'],
    title: 'Praise for a team effort',
    situation:
      'Your director publicly praises you for a successful project. You led it, but two colleagues did much of the hardest work behind the scenes, and their names weren’t mentioned.',
    question: 'What do you do?',
    options: [
      {
        id: 'a',
        label: 'Accept it. You did lead the project.',
        detail: 'Leaders get the credit; that’s how it works.',
        feedback:
          'You did play a central role, and accepting praise graciously is not wrong in itself. But staying silent when others carried much of the load lets an incomplete picture stand. Your colleagues will notice, and trust in your leadership may quietly erode.',
      },
      {
        id: 'b',
        label: 'Name them publicly, right away.',
        detail: 'Thank the director and specifically credit your colleagues’ work.',
        feedback:
          'This can feel like diminishing your own moment. In practice it usually does the opposite: it shows you see and value your team, and it gives credit where it is due. People want to work with leaders who share recognition.',
      },
      {
        id: 'c',
        label: 'Downplay your role entirely.',
        detail: 'Insist you didn’t really do much and it was all them.',
        feedback:
          'This comes from a modest instinct, but false modesty is also inaccurate. It can make the moment awkward and undervalue the real contribution you made. Humility is not pretending you did nothing; it is seeing your part truthfully, alongside everyone else’s.',
      },
    ],
    alignedOptionId: 'b',
    wiserPath:
      'Receive the thanks, then widen the circle: name the people whose work made it possible, specifically. Humility is honest about your own contribution and generous about others’. It costs little and builds a team that wants to succeed together.',
    connection:
      'Proverbs 11:2 contrasts pride, which leads to shame, with humility, which keeps company with wisdom. Seeing yourself accurately includes seeing others clearly.',
    followUp: 'Whose hidden contribution to your life or work could you acknowledge this week?',
  },
  {
    id: 'sc-friends-plan',
    proverbId: 'prov-27-6',
    topics: ['relationships', 'speech', 'integrity'],
    title: 'Your friend’s big plan',
    situation:
      'A close friend excitedly tells you they’re about to put their savings into opening a café. From what they describe, you have serious doubts about the location and the costs.',
    question: 'What do you say?',
    options: [
      {
        id: 'a',
        label: 'Be encouraging. It’s their dream.',
        detail: 'Support them now; they didn’t ask for criticism.',
        feedback:
          'Encouragement matters, and it is not your job to crush someone’s hopes. But if you see real risks and say nothing, your support may be costly to them later. Flattery feels kind in the moment; it is far less kind if they lose their savings on something you could have helped them think through.',
      },
      {
        id: 'b',
        label: 'Share your concerns honestly and kindly.',
        detail: 'Ask questions, name your specific doubts, and make clear you’re on their side.',
        feedback:
          'This is uncomfortable and may disappoint them at first. But concerns raised with care and good questions give them a chance to test their plan, not abandon it. Even if they go ahead, they will know you told them the truth because you care, which deepens trust.',
      },
      {
        id: 'c',
        label: 'Tell them bluntly it’s a bad idea.',
        detail: 'Better to be harsh now than watch them fail.',
        feedback:
          'Your honesty may be well meant, and directness has its place. But bluntness without care tends to make people defensive, so they dismiss the substance along with the tone. The aim is to help them see clearly, not to be proven right.',
      },
    ],
    alignedOptionId: 'b',
    wiserPath:
      'Be a faithful friend: affirm their courage, then honestly share specific concerns and ask questions that help them test the plan. Offer practical help. Then respect that the decision is theirs, and support them either way.',
    connection:
      'Proverbs 27:6 says the wounds of a friend are faithful. Honest words from someone who loves you are worth more than easy flattery.',
    followUp: 'Is there someone who needs you to be honest with them, lovingly? What would you say?',
  },
  {
    id: 'sc-jumping-to-fix',
    proverbId: 'prov-18-13',
    topics: ['relationships', 'speech'],
    title: 'The problem you could fix',
    situation:
      'Your partner starts telling you about a difficult conversation with their boss. Thirty seconds in, you already know what they should have said, and you’re itching to tell them.',
    question: 'What do you do?',
    options: [
      {
        id: 'a',
        label: 'Offer your solution straight away.',
        detail: 'You’re trying to help, and the answer seems obvious.',
        feedback:
          'Wanting to help is good, and your advice might be sound. But jumping in before they have finished often leaves people feeling unheard, and you may be solving a problem they did not actually have. They may simply need understanding, or there may be details that change everything.',
      },
      {
        id: 'b',
        label: 'Listen fully, then ask what they need.',
        detail: 'Let them finish, reflect back what you heard, then ask if they want advice.',
        feedback:
          'This takes patience when you think you already know the answer. But it ensures you respond to what they actually said, and it shows they matter more than your solution. If they want advice, they will be far more open to it.',
      },
      {
        id: 'c',
        label: 'Nod along while thinking about your reply.',
        detail: 'You’ll let them finish, then explain what they should do.',
        feedback:
          'This looks like listening, and it avoids interrupting. But mentally rehearsing your answer means you are still not really hearing them, and people can usually tell. Real listening means being willing to have your initial view changed by what they say.',
      },
    ],
    alignedOptionId: 'b',
    wiserPath:
      'Hear the whole story before forming a response. Summarise what you heard, ask how they are feeling, and ask whether they want ideas or just a listening ear. Understanding first makes any advice you offer more accurate and more welcome.',
    connection:
      'Proverbs 18:13 calls answering before hearing both folly and shame. Wisdom waits to understand before it speaks.',
    followUp: 'Who do you tend to answer before they have finished? What might you hear if you waited?',
  },
  {
    id: 'sc-forgotten-birthday',
    proverbId: 'prov-19-11',
    topics: ['relationships', 'emotions', 'humility'],
    title: 'The forgotten birthday',
    situation:
      'A good friend forgot your birthday this year, even though you always remember theirs. They haven’t mentioned it, and you’re feeling hurt.',
    question: 'What do you do?',
    options: [
      {
        id: 'a',
        label: 'Let it go.',
        detail: 'They’re probably busy; it’s not worth making an issue of it.',
        feedback:
          'Overlooking a small slight can be a real act of grace, and friendships thrive on it. This works well if you can genuinely release it. If you find yourself still keeping score weeks later, it was not truly let go, and a gentle conversation may be better for the friendship.',
      },
      {
        id: 'b',
        label: 'Mention it lightly.',
        detail: 'Say something like, "You missed my birthday — you owe me a coffee!"',
        feedback:
          'This can work well: it names the hurt without accusation and gives them an easy way to respond. It depends on your tone and the friendship. If there is a pattern of feeling overlooked, a lighter comment may not be enough, and a more honest conversation could be needed.',
      },
      {
        id: 'c',
        label: 'Pull back to show them how it feels.',
        detail: 'Be a little distant until they realise what they did.',
        feedback:
          'This is a natural response when you feel unvalued. But withdrawing as a signal rarely works: they may not notice, or may misread it, and the distance can grow. Small hurts handled through silent punishment tend to become larger ones.',
      },
    ],
    alignedOptionId: null,
    wiserPath:
      'For a one-off slight in a good friendship, overlooking it is often the most gracious choice. A light, warm mention is also healthy if it helps you move on. What matters is not holding onto it. If it is part of a wider pattern, an honest conversation is better than either silence or withdrawal.',
    connection:
      'Proverbs 19:11 says it is a person’s glory to overlook an offence. Good sense chooses which hurts to release, and does so freely.',
    followUp: 'Is there a small hurt you are still holding? Would it be better released or gently discussed?',
  },
  {
    id: 'sc-saying-yes',
    proverbId: 'prov-29-25',
    topics: ['work', 'emotions', 'relationships'],
    title: 'One more favour',
    situation:
      'Your manager asks if you can take on an extra project. You’re already stretched, but you want them to think well of you, and everyone else seems to say yes.',
    question: 'What do you say?',
    options: [
      {
        id: 'a',
        label: 'Say yes and make it work.',
        detail: 'You don’t want to look less committed than your colleagues.',
        feedback:
          'This keeps your manager happy in the moment and avoids an awkward conversation. But if you are already stretched, quality and wellbeing usually suffer, and the reputation you were protecting can be damaged by missed deadlines or burnout. Approval gained this way is fragile.',
      },
      {
        id: 'b',
        label: 'Explain your capacity and suggest options.',
        detail: 'Say what you’re working on and ask which priority should move if you take this on.',
        feedback:
          'This can feel exposing, especially if you want to be seen as dependable. But it is honest and constructive: your manager gets a clear picture and can make a good decision. Most managers respect people who know their limits and help solve the problem.',
      },
      {
        id: 'c',
        label: 'Say yes, then quietly do the minimum.',
        detail: 'Agree to avoid conflict, but don’t put much into it.',
        feedback:
          'This avoids saying no while protecting some of your time. But it trades an honest conversation now for disappointment later, and the gap between what you promised and what you delivered will eventually show. It is still being driven by the fear of what others think.',
      },
    ],
    alignedOptionId: 'b',
    wiserPath:
      'Be honest about your capacity and work with your manager on priorities. Saying yes or no should come from a clear view of what you can do well, not from fear of disappointing someone. Security that does not rest on others’ approval makes honesty possible.',
    connection:
      'Proverbs 29:25 calls the fear of man a snare and contrasts it with trust in God. When approval stops ruling us, we can be both honest and kind.',
    followUp: 'Where do you say yes mainly to avoid disappointing someone? What would an honest answer be?',
  },
  {
    id: 'sc-hot-tip',
    proverbId: 'prov-13-11',
    topics: ['money', 'decisions', 'integrity'],
    title: 'The can’t-miss opportunity',
    situation:
      'A friend shows you how much they’ve made in a few weeks from a new investment app and urges you to put in your emergency savings before "it takes off".',
    question: 'What do you do?',
    options: [
      {
        id: 'a',
        label: 'Invest a small amount you can afford to lose.',
        detail: 'Satisfy your curiosity without risking your savings.',
        feedback:
          'This limits the damage if things go wrong, and curiosity is natural. But it is worth asking why you are investing: if it is fear of missing out, small sums can easily grow. Check what you are actually buying and whether the platform is properly regulated before putting in anything.',
      },
      {
        id: 'b',
        label: 'Put in your emergency fund.',
        detail: 'Your friend’s results speak for themselves.',
        feedback:
          'Seeing real gains is persuasive, and missing out feels painful. But returns that look fast and easy are often unsustainable, and sometimes fraudulent. An emergency fund exists for emergencies; losing it could leave you in debt when life goes wrong.',
      },
      {
        id: 'c',
        label: 'Decline, and stick to your slower plan.',
        detail: 'Keep building savings steadily, even if you might miss a big win.',
        feedback:
          'This can feel dull, and you may see others boast about gains you missed. But steady, understood saving tends to compound reliably over time, without the stress of watching a volatile balance. Missing a possible win is often far less costly than losing what you depend on.',
      },
    ],
    alignedOptionId: 'c',
    wiserPath:
      'Protect what you depend on and build wealth patiently. Treat promises of quick returns with caution, keep emergency savings untouched, and only invest money you understand and can afford to lose. Slow and steady is less exciting, but it tends to last.',
    connection:
      'Proverbs 13:11 contrasts wealth that dwindles with wealth gathered "by hand". Patient, honest growth tends to endure where quick gain slips away.',
    followUp: 'Where are you tempted by a shortcut, in money or elsewhere? What would the slower path look like?',
  },
  {
    id: 'sc-overlooked-voice',
    proverbId: 'prov-31-8-9',
    topics: ['justice', 'speech', 'work'],
    title: 'The voice that gets talked over',
    situation:
      'In team meetings, a quieter new colleague keeps getting interrupted, and twice now someone else has repeated her idea and been credited for it.',
    question: 'What do you do?',
    options: [
      {
        id: 'a',
        label: 'Say something in the moment.',
        detail: 'Next time, say, "I think that was Priya’s point — Priya, do you want to finish?"',
        feedback:
          'This takes courage and may create a brief awkward moment. But it is direct, practical and restores her voice without attacking anyone. Done consistently, it quietly changes the culture of the meeting, and others often follow your lead.',
      },
      {
        id: 'b',
        label: 'Speak to her privately.',
        detail: 'Encourage her to be more assertive and offer support.',
        feedback:
          'Supporting her is kind, and she may appreciate knowing someone noticed. But placing the responsibility on her to change risks implying the problem is her quietness rather than the team’s habits. Private support works best alongside, not instead of, using your own voice.',
      },
      {
        id: 'c',
        label: 'Stay out of it.',
        detail: 'It’s not your place, and she might not want the attention.',
        feedback:
          'It is true that she may not want a fuss, and it is wise to be sensitive. But doing nothing lets the pattern continue, and those with more voice in the room are often best placed to change it. Asking her what would help is a respectful middle ground.',
      },
    ],
    alignedOptionId: 'a',
    wiserPath:
      'Use your voice where you have it. Redirect credit and space in the moment, and check privately with her about what kind of support she would welcome. Advocacy is most effective when it is consistent, specific, and respectful of the person you are standing with.',
    connection:
      'Proverbs 31:8–9 calls those with influence to speak up for people who are overlooked. Voice is a responsibility as well as a privilege.',
    followUp: 'Who around you is easily overlooked? How could you use your voice on their behalf?',
  },
  {
    id: 'sc-online-argument',
    proverbId: 'prov-26-4-5',
    topics: ['speech', 'wisdom', 'decisions'],
    title: 'The comment thread',
    situation:
      'Someone you vaguely know posts something misleading and mocking about a cause you care about. Their friends are piling on, and you’re tempted to reply.',
    question: 'What do you do?',
    options: [
      {
        id: 'a',
        label: 'Reply with a calm, factual correction.',
        detail: 'Post one clear response with a reliable source, then step away.',
        feedback:
          'This can help readers who are quietly watching, and a single calm reply models a better tone. The risk is being drawn into a long exchange. It works best if you decide in advance to say your piece once and not get pulled into point-scoring.',
      },
      {
        id: 'b',
        label: 'Reply in kind.',
        detail: 'Match their sarcasm; it’s the only language they understand.',
        feedback:
          'It can feel satisfying to hit back, and it may get laughs from your own side. But matching mockery with mockery usually hardens positions and drags you into behaviour you would not respect in others. It rarely changes minds.',
      },
      {
        id: 'c',
        label: 'Scroll past.',
        detail: 'Nothing you say will change their mind, so don’t engage.',
        feedback:
          'This protects your peace and is often wise when someone is not open to listening. The cost is that misleading claims go unanswered. Whether that matters depends on who is reading and how much harm the post could cause.',
      },
    ],
    alignedOptionId: null,
    wiserPath:
      'There is no single right move here. If the post is likely to mislead people or cause harm, one calm, factual reply may be worth it. If engaging would only feed a pointless fight, letting it go is equally wise. What matters is choosing deliberately, and never becoming like the thing you object to.',
    connection:
      'Proverbs 26:4–5 deliberately places "don’t answer a fool" next to "answer a fool". Wisdom is discerning which situation you are in.',
    followUp: 'Think of a recent argument, online or off. Did responding help? How might you decide next time?',
  },
  {
    id: 'sc-bad-builder',
    proverbId: 'prov-20-22',
    topics: ['justice', 'emotions', 'integrity'],
    title: 'The job left unfinished',
    situation:
      'A builder took a large deposit, did shoddy work, and stopped replying to your messages. You’re angry and want everyone to know what they did.',
    question: 'What do you do?',
    options: [
      {
        id: 'a',
        label: 'Post a furious review everywhere.',
        detail: 'Exaggerate a little if needed; they deserve it.',
        feedback:
          'Your anger is understandable, and warning others has value. But exaggeration turns a legitimate complaint into revenge, may expose you to legal risk, and undermines your credibility. It also keeps you emotionally tied to the person who wronged you.',
      },
      {
        id: 'b',
        label: 'Write an honest review and pursue a fair remedy.',
        detail: 'Describe what happened factually, and use proper channels to recover your money.',
        feedback:
          'This is slower and less satisfying than an outburst. But a factual account protects others, and formal complaints or small-claims routes address the actual wrong. It separates seeking justice from seeking to make them suffer.',
      },
      {
        id: 'c',
        label: 'Let it go and absorb the loss.',
        detail: 'Getting involved will only cause more stress.',
        feedback:
          'This can bring peace, and sometimes the cost of pursuing a matter outweighs the benefit. But it can also leave others vulnerable to the same treatment, and unaddressed injustice can turn into lingering bitterness. Letting go of revenge is different from giving up on fairness.',
      },
    ],
    alignedOptionId: 'b',
    wiserPath:
      'Refuse revenge, but do not abandon justice. Keep your account accurate, use legitimate channels to seek redress, and protect others with honest information. Then hand the outcome over, rather than letting the desire to see them pay take over your life.',
    connection:
      'Proverbs 20:22 says not to set out to pay back evil, but to wait for God’s justice. Seeking fairness is not the same as seeking revenge.',
    followUp: 'Is there someone you want to see "pay" for something? What would releasing that look like?',
  },
  {
    id: 'sc-performance-review',
    proverbId: 'prov-12-1',
    topics: ['discipline', 'work', 'humility'],
    title: 'The hard feedback',
    situation:
      'In your review, your manager says your work is strong but that you often miss details and come across as dismissive in meetings. It stings, especially the second part.',
    question: 'How do you respond?',
    options: [
      {
        id: 'a',
        label: 'Explain why they’re wrong.',
        detail: 'Give examples of your attention to detail and say others misunderstand you.',
        feedback:
          'Wanting to correct an unfair picture is natural, and some of it may be inaccurate. But leading with defence makes it harder to hear what might be true, and it signals that feedback is risky to give you. You may win the argument and lose the insight.',
      },
      {
        id: 'b',
        label: 'Thank them and ask for examples.',
        detail: 'Take time to reflect, then agree on one or two specific changes.',
        feedback:
          'This takes humility when you feel hurt. But asking for specifics turns vague criticism into something you can act on, and taking time to reflect means you can respond rather than react. If some of it is unfair, you can still discuss that once you understand it.',
      },
      {
        id: 'c',
        label: 'Accept it all and resolve to change everything.',
        detail: 'Agree with every point and promise to fix it immediately.',
        feedback:
          'This avoids conflict and shows willingness, which is good. But agreeing to everything without understanding it can lead to vague promises you cannot keep, or to internalising criticism that is not accurate. Teachability includes thinking carefully about what you have heard.',
      },
    ],
    alignedOptionId: 'b',
    wiserPath:
      'Receive correction with curiosity rather than defence or collapse. Thank them, ask for concrete examples, reflect privately, and choose one or two specific changes to work on. You can still disagree with parts of it, after you have truly understood it.',
    connection:
      'Proverbs 12:1 links loving correction with loving knowledge. Feedback that stings is often one of the fastest routes to growth.',
    followUp: 'What feedback have you received recently that you have been resisting? What might be true in it?',
  },
  {
    id: 'sc-friends-news',
    proverbId: 'prov-14-30',
    topics: ['emotions', 'relationships'],
    title: 'Their good news',
    situation:
      'An old friend posts that they’ve bought a beautiful house and been promoted, all in the same month. You’re still renting and feel stuck in your career. Your stomach sinks.',
    question: 'What do you do?',
    options: [
      {
        id: 'a',
        label: 'Like the post and move on quickly.',
        detail: 'Avoid thinking about it; you don’t want to feel this way.',
        feedback:
          'This avoids dwelling on a painful feeling, which can be healthy. But pushing envy away without understanding it means it often returns, especially if you keep scrolling. It can help to notice what the feeling is pointing to.',
      },
      {
        id: 'b',
        label: 'Congratulate them sincerely, then reflect.',
        detail: 'Send a warm message, then think about what the envy reveals about your own hopes.',
        feedback:
          'This asks you to celebrate someone else while you feel behind, which is not easy. But choosing to be glad for them loosens envy’s grip, and reflecting on what you want helps you act on it. Gratitude for your own life can sit alongside honest ambition.',
      },
      {
        id: 'c',
        label: 'Look for flaws in their story.',
        detail: 'Remind yourself that social media isn’t real and they probably have debt.',
        feedback:
          'It is true that posts show highlights, and that perspective can help. But hunting for reasons to diminish someone’s good news feeds envy rather than easing it, and it can sour a friendship. It also keeps your attention on their life instead of your own.',
      },
    ],
    alignedOptionId: 'b',
    wiserPath:
      'Name the feeling honestly, then choose generosity. Celebrate them sincerely, ask what the envy reveals about your own hopes, and take one step toward them. Limiting comparison triggers, such as endless scrolling, helps cultivate a heart at peace.',
    connection:
      'Proverbs 14:30 says a heart at peace gives life, but envy rots the bones. Envy damages the one who carries it far more than the one envied.',
    followUp: 'Who or what do you find yourself comparing yourself to? What is that comparison telling you?',
  },
];
