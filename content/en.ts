// English copy. `Dictionary` is derived from this file, so fa.ts must match its shape.

export const en = {
  meta: {
    siteName: "Nova",
    title: "Nova — AI agents & workflows for people and companies",
    description:
      "We design and build AI agents that take the repetitive part of the job off your plate — for one busy person, or a whole company. Farsi and English.",
    pages: {
      services: {
        title: "Services",
        description:
          "Personal assistants, workflow automation, customer chat agents, knowledge assistants, document processing and team training.",
      },
      work: {
        title: "Work",
        description: "Six agents we've put to work, and what changed after.",
      },
      about: {
        title: "About",
        description: "A small studio in Tehran building the quiet, reliable kind of AI.",
      },
      contact: {
        title: "Contact",
        description: "Book a free 30-minute call and tell us what eats your week.",
      },
    },
  },

  nav: {
    home: "Nova home",
    links: {
      services: "Services",
      work: "Work",
      about: "About",
      contact: "Contact",
    },
    cta: "Book a free call",
    menu: "Menu",
    close: "Close",
    skip: "Skip to content",
  },

  langSwitch: {
    label: "فارسی",
    aria: "Read this page in Farsi",
  },

  hero: {
    eyebrow: "AI agents & workflows studio",
    titleLines: ["Busywork,", "handled"],
    lede: "We find the work that eats your hours and your budget, then build AI agents that do it for you. You get time back, costs go down, and your workflow finally makes sense.",
    primary: "Book a free call",
    secondary: "See what we build",
    helper: "Not sure what to automate? The first call is free, and we'll figure it out together.",
    demoLabel: "See what changes when an agent takes over a workflow",
    xray: {
      today: "Today",
      withUs: "With Nova",
      total: "Your time on this, every day",
      agent: "Agent",
      min: "min",
      hour: "h",
      and: " ",
      none: "0 min of yours",
      collapsed: "{n} steps, now done by the agent",
    },
    useCases: [
      {
        id: "inbox",
        label: "Inbox",
        title: "A consultant's inbox",
        today: [
          { text: "Read every email", who: "You", minutes: 45 },
          { text: "Decide what matters", who: "You", minutes: 20 },
          { text: "Write the replies", who: "You", minutes: 60 },
          { text: "Find and attach files", who: "You", minutes: 15 },
          { text: "Chase follow-ups", who: "You", minutes: 20 },
        ],
        after: [
          { text: "Reads, sorts, drafts the replies and attaches the files", who: "Agent", minutes: 0 },
          { text: "Approve the drafts that matter", who: "You", minutes: 15 },
        ],
        metrics: [
          { label: "Your time a week", today: "13 h", after: "1 h 15 min" },
          { label: "What that time costs a month", today: "$2,100", after: "$240" },
          { label: "Average reply time", today: "6 h", after: "20 min" },
        ],
      },
      {
        id: "invoices",
        label: "Invoices",
        title: "An accounting team, 2,400 invoices a month",
        today: [
          { text: "Collect invoices from email and Telegram", who: "Accountant", minutes: 40 },
          { text: "Type amounts and dates into Excel", who: "Accountant", minutes: 120 },
          { text: "Match each one to an order", who: "Accountant", minutes: 90 },
          { text: "Enter them into Sepidar", who: "Accountant", minutes: 60 },
          { text: "Fix the typos at month end", who: "Senior accountant", minutes: 30 },
        ],
        after: [
          { text: "Collects, reads, matches and enters every invoice", who: "Agent", minutes: 0 },
          { text: "Check the few that don't add up", who: "Accountant", minutes: 25 },
        ],
        metrics: [
          { label: "Team time a week", today: "28 h", after: "2 h" },
          { label: "What that time costs a month", today: "$2,600", after: "$190" },
          { label: "Typos a month", today: "37", after: "2" },
        ],
      },
      {
        id: "bookings",
        label: "Bookings",
        title: "A dental clinic's front desk",
        today: [
          { text: "Answer calls and WhatsApp", who: "Reception", minutes: 150 },
          { text: "Check the doctor's calendar", who: "Reception", minutes: 40 },
          { text: "Book and confirm", who: "Reception", minutes: 60 },
          { text: "Call to remind the day before", who: "Reception", minutes: 60 },
          { text: "Fill cancelled slots", who: "Reception", minutes: 30 },
        ],
        after: [
          { text: "Answers, books, reminds and fills cancellations, day and night", who: "Agent", minutes: 0 },
          { text: "Handle the special cases", who: "Reception", minutes: 30 },
        ],
        metrics: [
          { label: "Front-desk time a week", today: "28 h", after: "2 h 30 min" },
          { label: "What that time costs a month", today: "$1,500", after: "$140" },
          { label: "Missed appointments", today: "18%", after: "6%" },
        ],
      },
      {
        id: "support",
        label: "Support",
        title: "An Instagram shop with 600 messages a day",
        today: [
          { text: "Read every DM and comment", who: "You", minutes: 90 },
          { text: "Look up the order", who: "You", minutes: 60 },
          { text: "Answer price, size and shipping", who: "You", minutes: 120 },
          { text: "Log sales in the spreadsheet", who: "You", minutes: 60 },
        ],
        after: [
          { text: "Answers, looks up orders and logs sales in 40 seconds", who: "Agent", minutes: 0 },
          { text: "Talk to the buyers who are ready", who: "You", minutes: 30 },
        ],
        metrics: [
          { label: "Your time a week", today: "38 h", after: "3 h 30 min" },
          { label: "What that time costs a month", today: "$2,300", after: "$210" },
          { label: "Average reply time", today: "4 h", after: "40 s" },
        ],
      },
    ],
    facts: ["Farsi & English", "Works with the tools you already use", "Live in 3–5 weeks"],
  },

  audience: {
    eyebrow: "Who it's for",
    title: "What would an agent do for you?",
    lede: "Pick the closest match. These are agents we've built, or something very close.",
    timeBack: "Time back",
    hoursPerWeek: "{n} h / week",
    total: "About {n} hours a week back",
    note: "Hours are typical for a team of 3–10. We measure yours in the first week.",
    pickHint: "Tap the ones you'd want — the total updates.",
    days: "That's about {n} working days a month.",
    cta: "Talk about these",
    daysShort: "≈ {n} working days a month",
    pick: "Pick at least one",
    none: "Pick at least one to see the time you'd get back.",
    segments: [
      {
        id: "solo",
        label: "Solo professionals",
        description: "Doctors, lawyers, consultants, designers — people whose time is the business.",
        agents: [
          {
            name: "Inbox & calendar agent",
            description: "Sorts your mail, drafts replies and books meetings without the back-and-forth.",
            hours: 6,
          },
          {
            name: "Client intake",
            description: "Collects details and documents before the first meeting, so you walk in prepared.",
            hours: 2,
          },
          {
            name: "Proposal drafts",
            description: "Turns your call notes into a proposal in your own format.",
            hours: 3,
          },
        ],
      },
      {
        id: "shops",
        label: "Online shops",
        description: "Instagram pages, web stores and marketplace sellers.",
        agents: [
          {
            name: "DM & order agent",
            description: "Answers price, size and shipping questions on Instagram and your site, and logs the orders.",
            hours: 15,
          },
          {
            name: "Product copy in bulk",
            description: "Writes titles and descriptions for 500 products from a spreadsheet and a folder of photos.",
            hours: 10,
          },
          {
            name: "Returns triage",
            description: "Checks the order, your returns policy and the photos, then suggests a decision.",
            hours: 4,
          },
        ],
      },
      {
        id: "clinics",
        label: "Clinics",
        description: "Dental, aesthetic, physio — anywhere that runs on appointments.",
        agents: [
          {
            name: "Bookings & reminders",
            description: "Books on WhatsApp and Telegram, sends reminders and fills cancelled slots from the waitlist.",
            hours: 12,
          },
          {
            name: "Patient questions",
            description: "Answers prep, price and location questions with wording you've approved.",
            hours: 5,
          },
          {
            name: "Visit summaries",
            description: "Turns the doctor's voice note into a clean record and a short summary for the patient.",
            hours: 6,
          },
        ],
      },
      {
        id: "offices",
        label: "Law & accounting",
        description: "Offices with piles of documents and nobody with time to read them all.",
        agents: [
          {
            name: "Case file search",
            description: "Ask in plain words, get the right precedent and the page it's on.",
            hours: 5,
          },
          {
            name: "Invoice reading",
            description: "Reads supplier invoices and enters them into your accounting software.",
            hours: 10,
          },
          {
            name: "Contract checks",
            description: "Flags missing clauses and odd terms before you read the whole thing.",
            hours: 4,
          },
        ],
      },
      {
        id: "teams",
        label: "Sales & ops teams",
        description: "Teams that spend half the day moving information between tools.",
        agents: [
          {
            name: "Lead research",
            description: "Looks up every new lead and writes the first message.",
            hours: 8,
          },
          {
            name: "Weekly reports",
            description: "Pulls the numbers from your tools and writes the summary your manager actually reads.",
            hours: 3,
          },
          {
            name: "Internal helpdesk",
            description: "Answers “where is…” and “how do I…” questions from your own docs.",
            hours: 6,
          },
        ],
      },
      {
        id: "hiring",
        label: "HR & hiring",
        description: "For when one job post brings in hundreds of CVs.",
        agents: [
          {
            name: "CV shortlist",
            description: "Reads every CV against your criteria and explains each pick.",
            hours: 8,
          },
          {
            name: "Interview scheduling",
            description: "Finds times that suit everyone and sends the invites.",
            hours: 3,
          },
          {
            name: "Onboarding buddy",
            description: "Answers a new hire's questions through their first month, at any hour.",
            hours: 4,
          },
        ],
      },
    ],
  },

  services: {
    eyebrow: "What we build",
    title: "Six kinds of agent",
    lede: "The work we get asked for most. Most projects start with one of these and grow from there.",
    examplesLabel: "For example",
    fitLabel: "Good fit if",
    timelineLabel: "Typical timeline",
    more: "All services",
    items: [
      {
        id: "assistant",
        title: "Personal AI assistants",
        description:
          "One agent for one busy person. It reads your email, keeps your calendar honest, drafts replies in your voice and reminds you of the things you'd forget.",
        examples: ["Inbox triage", "Meeting prep notes", "Follow-ups that actually happen"],
        fit: "You spend more than an hour a day on email and scheduling.",
        timeline: "2–3 weeks",
      },
      {
        id: "workflows",
        title: "Workflow automation",
        description:
          "Your tools already hold the data — it just doesn't move by itself. We connect spreadsheets, CRM, accounting and messengers so the copy-paste stops.",
        examples: ["Orders → accounting", "Forms → CRM", "Weekly reports, written for you"],
        fit: "Someone on your team copies data between tools every day.",
        timeline: "2–4 weeks",
      },
      {
        id: "support",
        title: "Customer chat agents",
        description:
          "Answers on your site, Instagram, Telegram or WhatsApp, day and night, in Farsi and English. When it isn't sure, it hands the chat to a person.",
        examples: ["Price & stock questions", "Order tracking", "Booking appointments"],
        fit: "The same twenty questions make up most of your messages.",
        timeline: "3–4 weeks",
      },
      {
        id: "knowledge",
        title: "Knowledge assistants",
        description:
          "Everything your company knows, in one place you can ask. Policies, past projects, product specs — with the source under every answer.",
        examples: ["New-hire questions", "Policy lookups", "Searching past projects"],
        fit: "New people keep asking the same senior people the same things.",
        timeline: "3–5 weeks",
      },
      {
        id: "documents",
        title: "Document processing",
        description:
          "Invoices, contracts, CVs, forms. The agent reads them, pulls out what matters, checks it and files it where it belongs.",
        examples: ["Purchase invoices", "Contract review", "CV screening"],
        fit: "You handle more than a few hundred documents a month.",
        timeline: "3–5 weeks",
      },
      {
        id: "training",
        title: "Team training",
        description:
          "Hands-on workshops so your team uses AI tools well — and knows when not to. Built around your actual work, not slides.",
        examples: ["Half-day workshop", "Internal playbook", "A month of follow-up"],
        fit: "Your team has AI tools but uses them for maybe one thing.",
        timeline: "1–4 weeks",
      },
    ],
  },

  process: {
    eyebrow: "How it works",
    title: "From first call to first agent",
    lede: "Usually one to two months from the first conversation to an agent doing real work every day.",
    steps: [
      {
        title: "Free call",
        duration: "30 minutes",
        description:
          "Tell us where the hours go. We'll tell you honestly whether AI can help — sometimes it can't, and we'll say so.",
      },
      {
        title: "Mapping week",
        duration: "1 week, fixed price",
        description:
          "We sit with you or your team, map one workflow end to end and pick the first agent with the clearest payoff.",
      },
      {
        title: "Build",
        duration: "2–4 weeks",
        description:
          "We build it, test it on your real data and show you progress every week. Nothing goes live until you're happy with it.",
      },
      {
        title: "Run & improve",
        duration: "Monthly",
        description:
          "We watch how it performs, fix what's off and add the next agent when you're ready. Cancel any month.",
      },
    ],
  },

  cases: {
    eyebrow: "Work",
    title: "Work that's already working",
    lede: "A few of the agents we've put to work, and what changed after.",
    agent: "Agent",
    previous: "Previous",
    next: "Next",
    show: "Show case {n} of {total}",
    more: "See all work",
    items: [
      {
        id: "kalaland",
        client: "Kalaland",
        sector: "Online home goods store",
        flow: ["Instagram DM", "Order logged"],
        title: "A DM agent that actually sells",
        summary:
          "Kalaland's two-person team was answering 600 Instagram messages a day. Now the agent handles price, size and shipping questions, and passes real buyers to a human.",
        metrics: [
          { value: "68%", label: "of messages answered with nobody involved" },
          { value: "40 s", label: "average reply time, down from 4 hours" },
        ],
      },
      {
        id: "labkhand",
        client: "Labkhand Dental Clinic",
        sector: "Dental clinic",
        flow: ["WhatsApp", "Booked"],
        title: "Bookings that fill themselves",
        summary:
          "Reception spent half the day on the phone. The agent books on WhatsApp, sends a reminder the day before and offers cancelled slots to the waitlist.",
        metrics: [
          { value: "−31%", label: "missed appointments" },
          { value: "12 h", label: "a week back for reception" },
        ],
      },
      {
        id: "tarazoo",
        client: "Tarazoo Accounting",
        sector: "Accounting firm",
        flow: ["Invoice PDF", "Sepidar"],
        title: "2,400 invoices a month, read and booked",
        summary:
          "Invoices arrive as photos, PDFs and the odd Excel file. The agent reads them, matches them to orders and enters them in Sepidar. Anything that doesn't add up goes to an accountant.",
        metrics: [
          { value: "40 s", label: "per invoice, down from 9 minutes" },
          { value: "99.2%", label: "of fields right on the first pass" },
        ],
      },
      {
        id: "dadvar",
        client: "Dadvar Law Office",
        sector: "Law office",
        flow: ["A question", "Answer + page"],
        title: "Eleven years of case files, searchable",
        summary:
          "Precedent lived in the partners' heads. Now associates ask the knowledge assistant and get the answer with the file name and page number.",
        metrics: [
          { value: "10 min", label: "to find a precedent, down from 2 hours" },
          { value: "11 yrs", label: "of case files, now searchable" },
        ],
      },
      {
        id: "novinsoft",
        client: "Novin Soft",
        sector: "Software company",
        flow: ["600 CVs", "Shortlist"],
        title: "From 600 CVs to a shortlist in a day",
        summary:
          "Every job post brought in hundreds of CVs and screening took two weeks. The agent scores each one against the tech team's criteria and writes down why for every pick.",
        metrics: [
          { value: "1 day", label: "to a shortlist, down from 2 weeks" },
          { value: "100%", label: "of picks come with a reason" },
        ],
      },
      {
        id: "sara",
        client: "Sara Rahimi",
        sector: "Independent architect",
        flow: ["Inbox", "Proposal"],
        title: "A personal assistant for a one-person studio",
        summary:
          "Sara's evenings went to email and quotes. Her agent sorts the inbox, drafts replies and turns site-visit notes into proposals.",
        metrics: [
          { value: "6 h", label: "a week back" },
          { value: "2 h", label: "to send a proposal, down from 2 days" },
        ],
      },
    ],
  },

  testimonials: {
    eyebrow: "Clients",
    title: "In their words",
    previous: "Previous",
    next: "Next",
    show: "Show testimonial {n} of {total}",
    items: [
      {
        quote:
          "I was sceptical — we'd tried chatbots before. This one actually knows our products, and when it doesn't, it says so and calls one of us.",
        name: "Maryam Ahmadi",
        role: "Founder, Kalaland",
      },
      {
        quote:
          "Our receptionist used to say she had two jobs: the phone, and everything else. Now she only has the second one.",
        name: "Dr. Reza Karimi",
        role: "Labkhand Dental Clinic",
      },
      {
        quote:
          "They didn't sell us AI. They spent a week watching how we work, then fixed the one thing that was costing us the most.",
        name: "Neda Farahani",
        role: "Partner, Tarazoo Accounting",
      },
      {
        quote:
          "The best part is that it shows the page it got the answer from. That's why the partners trust it.",
        name: "Ali Dadvar",
        role: "Dadvar Law Office",
      },
      {
        quote: "I have my evenings back. That's the whole review.",
        name: "Sara Rahimi",
        role: "Architect",
      },
    ],
  },

  faq: {
    eyebrow: "FAQ",
    title: "Questions we get a lot",
    items: [
      {
        question: "Do I need to be technical?",
        answer:
          "No. If you can explain how you do the work today, that's enough. We handle the rest, and show you how to use the finished agent.",
      },
      {
        question: "Is our data safe?",
        answer:
          "Your data is only used to do your work — never to train anyone else's model. For sensitive work we can run everything on your own servers.",
      },
      {
        question: "Does it work in Farsi?",
        answer: "Yes. Farsi, English, and the mix most of us actually type in — Finglish included.",
      },
      {
        question: "Which tools can it connect to?",
        answer:
          "Most of what you already use: Gmail and Google Workspace, Excel, Notion, Telegram, WhatsApp, Instagram, Bale, and accounting software like Sepidar and Hamkaran. If it has an API or an export, we can usually work with it.",
      },
      {
        question: "What if the agent gets something wrong?",
        answer:
          "Sometimes it will, so we design for it. Anything important waits for a person to approve, every action is logged, and we tune it every week at the start.",
      },
      {
        question: "How much does it cost?",
        answer:
          "The mapping week has a fixed price. After it you get a fixed quote for the build before we start, so there are no surprises. Running costs are monthly and you can stop any time.",
      },
    ],
  },

  pages: {
    services: {
      flow: ["Email", "Agent", "Calendar"],
      eyebrow: "Services",
      title: "What we build",
      lede: "Six kinds of agent, each built around how you already work. Start with one; add the next when the first one has earned it.",
    },
    work: {
      flow: ["Messages", "Agent", "Results"],
      eyebrow: "Work",
      title: "Agents at work",
      lede: "Six projects — what we built, and what changed after.",
    },
    about: {
      flow: ["People", "Agents", "Time back"],
      eyebrow: "About",
      title: "A small studio building AI that's actually useful",
      lede: "We're engineers and designers who got tired of AI demos that never made it into anyone's working day. So we build the quiet, reliable kind: agents that show up to work.",
      story: [
        "Nova started in 2023, when a friend's clinic asked us for help with bookings. Their receptionist was answering the same eight questions two hundred times a day. We built a small agent to handle them, and she got her afternoons back.",
        "Word got around. Since then we've built more than forty agents for shops, clinics, offices and people who work on their own — mostly in Tehran, a few in Toronto, Dubai and Berlin. The work changes; the approach doesn't. Find the work nobody wants to do, and hand it to something that doesn't mind.",
      ],
      timeline: ["2023 · First agent", "2024 · Word got around", "Today · 40+ agents"],
      facts: [
        { value: "2023", label: "Founded" },
        { value: "40+", label: "Agents in production" },
        { value: "Tehran", label: "And remote" },
        { value: "2", label: "Languages, plus Finglish" },
      ],
      principlesTitle: "What we hold to",
      principles: [
        {
          title: "Boring beats clever",
          description: "We pick the simplest thing that works, built on tools that won't break next month.",
        },
        {
          title: "People stay in charge",
          description: "Agents ask before anything that matters: money, customers, anything you can't undo.",
        },
        {
          title: "Your data stays yours",
          description: "Used only for your work. On your own servers if you need it.",
        },
        {
          title: "Start small, prove it",
          description: "One workflow first, measured. Then the next.",
        },
      ],
      teamTitle: "Who you'll work with",
      team: [
        { name: "Kian Mostafavi", initials: "KM", role: "Founder · Engineering" },
        { name: "Shirin Jafari", initials: "SJ", role: "Design & research" },
        { name: "Arash Tehrani", initials: "AT", role: "AI engineer" },
        { name: "Leila Navabi", initials: "LN", role: "Delivery & clients" },
      ],
    },
    contact: {
      flow: ["Your message", "Our team", "A call"],
      eyebrow: "Contact",
      title: "Tell us what eats your week",
      lede: "Start with a free 30-minute call. Whether or not we end up working together, you'll leave with at least one idea you can use.",
      form: {
        needsLabel: "What should come off your plate?",
        needs: [
          "Email & calendar",
          "Customer messages",
          "Invoices & documents",
          "Moving data between tools",
          "Company knowledge",
          "Team training",
          "Not sure yet",
        ],
        sizeLabel: "Who's it for?",
        sizes: ["Just me", "2–10 people", "11–50 people", "50+ people"],
        nameLabel: "Your name",
        contactLabel: "Email or phone",
        messageLabel: "Anything else we should know?",
        messagePlaceholder: "e.g. We answer around 200 Instagram messages a day and it eats our afternoons.",
        submit: "Send by email",
        submitHint: "Opens your email app with everything filled in — you just press send.",
        missing: "Add your name and a way to reach you.",
        emailSubject: "New project — {name}",
        emailNeeds: "Wants help with",
        emailSize: "Team size",
        emailContact: "Reach me at",
      },
      channels: {
        title: "Or reach us directly",
        email: "Email",
        telegram: "Telegram",
        whatsapp: "WhatsApp",
        phone: "Phone",
        hours: "Saturday to Wednesday, 9:00 to 18:00 Tehran time",
        reply: "We reply within one working day.",
      },
    },
  },

  footer: {
    flow: ["Busywork", "Agent", "Done"],
    ctaTitle: "Got a task you'd rather never do again?",
    ctaButton: "Book a free call",
    tagline: "AI agents & workflows for people and companies.",
    pagesTitle: "Pages",
    contactTitle: "Contact",
    rights: "© 2026 Nova. Made in Tehran.",
  },

  notFound: {
    title: "This page took the day off",
    body: "The link may be old, or the page moved. Everything else is still working.",
    back: "Back to home",
  },
};

export type Dictionary = typeof en;
