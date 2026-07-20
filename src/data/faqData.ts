// Define the FAQ item type
export interface FAQItem {
  question: string;
  answer: string;
}

export const faqData: FAQItem[] = [
  { 
    question: "What is BRT150?", 
    answer: "BRT150 is a curated networking event connecting entrepreneurs, professionals, and investors across Africa." 
  },
  { 
    question: "Who can attend?", 
    answer: "Entrepreneurs, professionals, investors, and strategic partners who are looking to connect and grow." 
  },
  { 
    question: "Is registration required?", 
    answer: "Yes, registration is mandatory as seats are limited to 150 curated attendees." 
  },
  { 
    question: "Will investors be attending?", 
    answer: "Yes, we have confirmed attendance from angel investors, venture capital firms, and family offices." 
  },
  { 
    question: "How many seats are available?", 
    answer: "Only 150 seats are available for this exclusive event." 
  },
  { 
    question: "Can I transfer my ticket?", 
    answer: "Ticket transfers are subject to approval. Please contact our team for assistance." 
  }
];