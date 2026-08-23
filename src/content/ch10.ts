import type { Chapter } from '@/lib/types';

export const ch10: Chapter = {
  slug: 'financial-literacy',
  number: 10,
  title: 'Understanding Financial Literacy',
  studentSubtitle: 'Money, budgeting, and not going broke',
  themeColor: '#00854F',
  themeColorDark: '#31B27D',
  blurb:
    "The money decisions you make this year follow you for years — the card you open, the loan you sign, the habit of saving (or not) from every paycheck. This chapter hands you a plan you can actually use: build a budget that balances, start an emergency fund, use credit without getting burned, and pay for college with as little debt as possible. How you act today shapes your tomorrow, and small steps now count.",
  keyIdeas: [
    'Financial planning is a five-step loop — set goals, evaluate options, write the plan, implement it, then monitor and adjust — and it works just as well for a $12,000 car as for a week of groceries.',
    'A budget has three parts (income, saving and investing, and expenses), and a good one gives every dollar a job so the balance lands at zero.',
    'Paying yourself first — setting money aside before you spend — is what turns a paycheck into an emergency fund and, over time, into net worth: what you own minus what you owe.',
    'Compound interest works for you in a savings account and against you on a credit card, which is why the book says to pay your card down to $0 every single month.',
    'Chase free money first (grants, scholarships, work-study, employer help), and keep any undergraduate loans at or below the salary you expect to earn in your first year out.',
  ],
  sections: [
    'Personal Financial Planning',
    'Savings, Expenses, and Budgeting',
    'Banking and Emergency Funds',
    'Credit Cards and Other Debt',
    'Education Debt: Paying for College',
    'Defending against Attack: Securing Your Identity and Accounts',
  ],
  openstaxUrl: 'https://openstax.org/books/college-success/pages/10-introduction',
  flashcards: [
    {
      id: 'c10-1',
      front: 'What are the five steps of the financial planning process?',
      back: 'Develop personal goals, identify and evaluate alternatives for your situation, write your financial plan, implement the plan, and monitor and adjust it. The last step matters most day to day: keep taking small steps each week and adjust when life changes.',
      section: 'Personal Financial Planning',
    },
    {
      id: 'c10-2',
      front: 'You are about to make a big purchase, like a car or a laptop. What does the book say to do first?',
      back: "Start with what you actually need, research your alternatives, and write the plan down — item, features, budget, and timeline — before you shop. Then bring the written plan with you and stick to it, and take a responsible friend along if pressure is hard to resist.",
      section: 'Personal Financial Planning',
    },
    {
      id: 'c10-3',
      front: 'Budget',
      back: 'A specific financial plan for a specified period of time. Every budget has three elements: income, saving and investing, and expenses.',
      section: 'Savings, Expenses, and Budgeting',
    },
    {
      id: 'c10-4',
      front: 'Net pay (disposable income)',
      back: "What's left of your paycheck after taxes and other deductions come out. It is the only money you can actually use to pay bills, so build your budget on net pay rather than gross pay.",
      section: 'Savings, Expenses, and Budgeting',
    },
    {
      id: 'c10-5',
      front: 'What does "pay yourself first" mean?',
      back: 'Set aside money for savings and investments before you pay bills or make optional purchases. Put something into savings from every paycheck or gift — automatic transfers and payroll deductions work well because the money is saved before you can spend it.',
      section: 'Savings, Expenses, and Budgeting',
    },
    {
      id: 'c10-6',
      front: 'Your budget comes out negative this month. What are your options?',
      back: 'Look at all three parts of the budget: increase income, reduce what you put into savings, or cut expenses — often some combination. The book warns that adding hours alongside coursework quickly becomes overwhelming, and that borrowing to cover the gap is the least desirable option because it makes later months worse.',
      section: 'Savings, Expenses, and Budgeting',
    },
    {
      id: 'c10-7',
      front: 'Emergency fund',
      back: 'A cash reserve set aside specifically for unplanned expenses like a car repair, a broken computer, a medical bill, or lost income. Students in financial literacy classes commonly recommend about $1,000, kept in a bank and separate from your spending money. Pizza is not an emergency.',
      section: 'Banking and Emergency Funds',
    },
    {
      id: 'c10-8',
      front: 'Compound interest',
      back: 'You earn interest on the money you deposit (the principal), and after that you earn interest on the principal plus all the interest already paid to you. It builds your savings over time — and it works against you the same way on credit cards and loans.',
      section: 'Banking and Emergency Funds',
    },
    {
      id: 'c10-9',
      front: 'Your bank asks whether you want overdraft protection on your debit card. What should you consider?',
      back: "Overdraft protection lets you buy things when your account is empty, but the bank charges a fee — perhaps $25 — every time. The book suggests considering opting out and tracking your balance instead, so you only spend money you actually have.",
      section: 'Banking and Emergency Funds',
    },
    {
      id: 'c10-10',
      front: 'How should you use a credit card?',
      back: "Only for things you can already afford — the money should already be sitting in your bank account and budgeted for that purchase. Pay the balance down to $0 every month; if you are even one cent short, you owe daily interest on the entire amount going back to the purchase date.",
      section: 'Credit Cards and Other Debt',
    },
    {
      id: 'c10-11',
      front: 'What should you look for in your first credit card?',
      back: 'A low APR, no annual fee or minimum usage requirement, and a credit limit around two weeks of take-home pay so a mistake stays small. The book also advises skipping rewards cards until paying in full each month is a solid habit.',
      section: 'Credit Cards and Other Debt',
    },
    {
      id: 'c10-12',
      front: 'Credit score',
      back: 'A number, usually on a 300–850 scale, that shows lenders how reliably you repay; 670–739 is considered good. It is built from payment history (35%), credit utilization (30%), length of credit history (15%), new credit (10%), and credit mix (10%) — so pay on time and keep what you owe under 30 percent of your available credit.',
      section: 'Credit Cards and Other Debt',
    },
    {
      id: 'c10-13',
      front: 'How much student loan debt is reasonable to take on?',
      back: "For an associate or bachelor's degree, aim to keep total student loans equal to or less than the salary you expect to earn in your first year after graduation. Research real starting salaries first — most students expect to earn significantly more than they actually will.",
      section: 'Education Debt: Paying for College',
    },
    {
      id: 'c10-14',
      front: 'FAFSA',
      back: 'The Free Application for Federal Student Aid — the federal form that qualifies you for federal aid and opens the door to nearly all other aid, since most grants and scholarships base decisions on it. You have to file it for every year you are in school.',
      section: 'Education Debt: Paying for College',
    },
    {
      id: 'c10-15',
      front: 'What are the first lines of defense against identity theft?',
      back: 'Long passphrases of 12 characters or more, varied for each site, plus two-factor authentication on your email, bank, and other accounts so a thief would need your phone as well as your password. Shred anything with your name on it, and check your credit report once a year at annualcreditreport.com.',
      section: 'Defending against Attack: Securing Your Identity and Accounts',
    },
    {
      id: 'c10-16',
      front: 'Someone calls saying they are from your bank and asks you to confirm your account information. What should you do?',
      back: "Never give personal information to someone who contacted you. Say you will call back, ignore the number or website they offer, and look up the organization's official number yourself. A legitimate company or agency will never require you to stay on the line to solve a problem.",
      section: 'Defending against Attack: Securing Your Identity and Accounts',
    },
  ],
  assessments: [
    {
      id: 'c10-a1',
      title: 'How financially literate are you right now?',
      kind: 'likert',
      estMinutes: 3,
      intro:
        "Adapted from the chapter's student survey. Rate each statement from 1 (least like me) to 5 (most like me) — this is a snapshot of where you're starting, not a grade.",
      items: [
        { id: 'c10-a1-1', text: 'I actively and regularly plan and monitor my finances.' },
        { id: 'c10-a1-2', text: 'I know roughly how much money comes in and goes out each month.' },
        { id: 'c10-a1-3', text: 'I can tell the difference between a need and a want before I buy something.' },
        { id: 'c10-a1-4', text: 'I put something into savings from every paycheck, gift, or refund.' },
        { id: 'c10-a1-5', text: 'I have money set aside for an unexpected expense like a car repair or a broken laptop.' },
        { id: 'c10-a1-6', text: 'I understand the benefits and the risks of using credit.' },
        { id: 'c10-a1-7', text: 'I have a plan for repaying any student loans I take out.' },
        { id: 'c10-a1-8', text: 'I regularly take steps to protect my identity and my accounts.' },
      ],
      resultBands: [
        {
          min: 8,
          max: 18,
          label: 'Plenty of room to grow',
          advice:
            "You're at the start of this, and that's a genuinely good place to be — the habits are learnable and the chapter treats money management like a game you get good at with practice. Pick one small step this week: write down what you actually spent in the last seven days, and mark each purchase as a need or a want. Once you can see where the money goes, building a one-month budget with income, savings, and expenses becomes much easier.",
        },
        {
          min: 19,
          max: 29,
          label: 'Building solid habits',
          advice:
            "You already have real instincts here, and a few specific moves would strengthen them. Try making your budget balance to zero so every dollar has a job, and set a concrete emergency fund goal with a date for the first deposit — many students aim for around $1,000. If credit or student loans are the fuzzy part, a visit to your college's financial aid office and a look at your card's APR and limit will clear up a lot fast.",
        },
        {
          min: 30,
          max: 40,
          label: 'Confident and in control',
          advice:
            "You're planning ahead and tracking your money, which gives you a useful foundation. Keep the momentum by going deeper: research real starting salaries in your field so your borrowing stays tied to your expected income, and look for funding you haven't claimed yet — grants, campus scholarships, work-study, and employer tuition help. Then protect what you've built with two-factor authentication and an annual credit report check.",
        },
      ],
    },
    {
      id: 'c10-a2',
      title: "What would you tell Elan?",
      kind: 'reflection',
      estMinutes: 6,
      intro:
        "The chapter opens with a student whose plan came apart fast. Thinking through what went wrong is the easiest way to spot the same pressure points in your own life.",
      items: [],
      prompt:
        "Elan started the year with over $1,000 saved and a plan to stay within set limits. A salesperson talked them into a $2,000 laptop with a small down payment and $100 monthly payments. Three months later Elan was working more hours (and studying fewer), had missed a payment, picked up a late fee, and was alternating payments between the laptop, a credit card, and a car while creditors started calling. Elan comes to you and asks, \"What could I have done differently?\" — what do you tell them, and at which specific moment would that advice have changed the outcome? Then turn the question on yourself: where are you losing money right now to fees or interest, and what is one action you could take this month to stop giving that money away and start earning it instead?",
    },
    {
      id: 'c10-a3',
      title: 'Money moves to make this month',
      kind: 'checklist',
      estMinutes: 2,
      intro:
        'Concrete first steps drawn from the chapter. You do not have to do them all at once — check off one, then come back for the next.',
      items: [
        { id: 'c10-a3-1', text: 'List your last ten purchases and mark each one as a need or a want, then compare the two totals.' },
        { id: 'c10-a3-2', text: 'Build a one-month budget with three sections — net income, saving and investing, expenses — and adjust it until the balance is zero.' },
        { id: 'c10-a3-3', text: 'Set an emergency fund goal (many students aim for about $1,000), pick where it will live, and put a first deposit date on your calendar.' },
        { id: 'c10-a3-4', text: 'Compare a local bank, a credit union, and an online bank on monthly fees, ways to avoid fees, ATM access, and interest rates.' },
        { id: 'c10-a3-5', text: 'Check whether overdraft protection is turned on for your debit card and decide whether you want to opt out.' },
        { id: 'c10-a3-6', text: "File this year's FAFSA and make an appointment at your financial aid office to ask about grants, scholarships, and work-study." },
        { id: 'c10-a3-7', text: 'Turn on two-factor authentication for your email and bank accounts, and replace any password under 12 characters with a longer passphrase.' },
        { id: 'c10-a3-8', text: "Request your free credit report at annualcreditreport.com and look for accounts or details you don't recognize." },
      ],
    },
  ],
};
