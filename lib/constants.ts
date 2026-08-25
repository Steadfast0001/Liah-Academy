const PARTNERSHIP_EMAIL = 'info@liahacademy.com';
const PARTNERSHIP_SUBJECT = 'Partnership Opportunity: [Your Organization Name] & Liah Academy';

const PARTNERSHIP_BODY = `Dear Liah Academy,

I am writing to explore a potential collaboration between [Your Organization Name] and Liah Academy.

We have been closely following your work in technology education and software development, particularly your focus on practical technical training. At [Your Organization Name], we specialize in [Brief 1-sentence summary of your core value proposition or services].

Given our complementary strengths, a strategic partnership could create significant mutual value. Specifically, we see strong potential to collaborate on:

[Initiative 1]: [1-sentence description of mutual project or co-marketing opportunity]

[Initiative 2]: [1-sentence description of shared audience or technical integration]

[Initiative 3]: [1-sentence description of resource sharing or community impact]

Would you be open to a brief 15-minute call next week to discuss how we might work together? Please let me know your availability for [Day of Week, e.g., Tuesday] or [Day of Week, e.g., Thursday].

Thank you for your time and consideration.

Warm regards,

[Your Full Name]

[Your Title/Role]

[Your Organization Name]

[Phone Number] | [Website Link] | [LinkedIn/Portfolio]`;

export const PARTNERSHIP_MAILTO_LINK = `mailto:${PARTNERSHIP_EMAIL}?subject=${encodeURIComponent(PARTNERSHIP_SUBJECT)}&body=${encodeURIComponent(PARTNERSHIP_BODY)}`;
