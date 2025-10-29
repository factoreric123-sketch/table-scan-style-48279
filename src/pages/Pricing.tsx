import PageLayout from "@/components/layouts/PageLayout";
import PricingCard from "@/components/PricingCard";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const Pricing = () => {
  const pricingPlans = [
    {
      title: "Free Forever",
      price: "$0",
      description: "Perfect for single-location restaurants getting started",
      features: [
        "1 restaurant",
        "Unlimited dishes & categories",
        "QR code generation",
        "10+ beautiful themes",
        "Mobile-optimized menus",
        "Real-time menu updates",
        "Basic analytics"
      ],
      ctaText: "Get Started Free",
      ctaLink: "/auth?signup=true"
    },
    {
      title: "Professional",
      price: "$19",
      description: "For growing restaurants and small chains",
      features: [
        "Up to 5 restaurants",
        "Everything in Free, plus:",
        "Advanced themes & customization",
        "Custom domain support",
        "Advanced analytics & insights",
        "Priority email support",
        "Remove TAPTAB branding",
        "Export menu data"
      ],
      ctaText: "Start Free Trial",
      ctaLink: "/auth?signup=true",
      popular: true
    },
    {
      title: "Enterprise",
      price: "Custom",
      description: "For restaurant groups and franchises",
      features: [
        "Unlimited restaurants",
        "Everything in Professional, plus:",
        "White-label solution",
        "API access",
        "Dedicated account manager",
        "Custom integrations",
        "SLA guarantee",
        "Advanced security features"
      ],
      ctaText: "Contact Sales",
      ctaLink: "/contact"
    }
  ];

  const faqs = [
    {
      question: "Is the free plan really free forever?",
      answer: "Yes! The free plan includes everything you need for one restaurant with unlimited dishes, categories, and menu updates. No credit card required, no hidden fees, no time limits."
    },
    {
      question: "Can I upgrade or downgrade anytime?",
      answer: "Absolutely. You can upgrade to Professional anytime to unlock more features and locations. Downgrade with no penalties – we'll just adjust your access to match your plan."
    },
    {
      question: "What happens if I exceed my plan limits?",
      answer: "We'll notify you when you're approaching your limits. You can either upgrade to the next plan or remove some restaurants to stay within your current tier."
    },
    {
      question: "Do you offer annual discounts?",
      answer: "Yes! Pay annually and save 20% on Professional and Enterprise plans. That's like getting 2 months free."
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept all major credit cards (Visa, Mastercard, American Express) and PayPal. Enterprise customers can also pay via bank transfer with annual invoicing."
    },
    {
      question: "Is there a setup fee?",
      answer: "No setup fees, ever. What you see is what you pay – simple, transparent pricing."
    },
    {
      question: "Can I try Professional features before upgrading?",
      answer: "Yes! Start with the free plan and we offer a 14-day free trial when you upgrade to Professional. No credit card required for the trial."
    },
    {
      question: "What if I need help migrating my existing menu?",
      answer: "Professional and Enterprise plans include migration assistance. Our team will help you import your existing menu data quickly and accurately."
    }
  ];

  return (
    <PageLayout>
      {/* Hero */}
      <section className="bg-muted/30 py-24">
        <div className="container mx-auto px-4 max-w-6xl text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Simple, Transparent Pricing
          </h1>
          <p className="text-xl text-muted-foreground mb-4">
            Start free, upgrade when you need more. No credit card required.
          </p>
          <p className="text-sm text-muted-foreground">
            Save 20% with annual billing
          </p>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-24">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="grid md:grid-cols-3 gap-8 md:gap-6 items-start">
            {pricingPlans.map((plan, index) => (
              <PricingCard key={index} {...plan} />
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-muted/30 py-24">
        <div className="container mx-auto px-4 max-w-3xl">
          <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">
            Frequently Asked Questions
          </h2>
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`} className="bg-background rounded-lg px-6">
                <AccordionTrigger className="text-left hover:no-underline">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            Create your digital menu in minutes. No credit card required.
          </p>
        </div>
      </section>
    </PageLayout>
  );
};

export default Pricing;
