import React from 'react';

const ReturnsPage = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 md:px-10 py-16">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Return Policy</h1>
          <p className="text-lg text-foreground/80 max-w-2xl mx-auto">
            Learn about our easy return process and eligibility requirements.
          </p>
        </div>

        <div className="mb-12">
          <h2 className="text-2xl font-bold text-foreground mb-6">Return Eligibility</h2>
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-2">Time Frame</h3>
              <p className="text-foreground/80">
                You have 30 days from the date of delivery to initiate a return. Items received after this period will not be accepted.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-2">Condition Requirements</h3>
              <p className="text-foreground/80">
                Items must be in their original condition, unworn, unwashed, and with all tags attached. Items must be returned in their original packaging.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-2">Exclusions</h3>
              <p className="text-foreground/80">
                Custom-made items, personalized products, and intimate apparel cannot be returned unless defective.
              </p>
            </div>
          </div>
        </div>

        <div className="mb-12">
          <h2 className="text-2xl font-bold text-foreground mb-6">How to Return</h2>
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-2">Step 1: Initiate Your Return</h3>
              <p className="text-foreground/80">
                Contact our customer service team within 30 days of delivery to request a return authorization. 
                Provide your order number and reason for return.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-2">Step 2: Prepare Your Package</h3>
              <p className="text-foreground/80">
                Pack the item(s) securely in the original packaging if possible. Include all tags, accessories, and documentation.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-2">Step 3: Ship Your Return</h3>
              <p className="text-foreground/80">
                Use the return shipping label provided by our customer service team. 
                Keep the tracking information for your records.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-2">Step 4: Receive Your Refund</h3>
              <p className="text-foreground/80">
                Once we receive and inspect your return, we'll process your refund to the original payment method. 
                Please allow 5-10 business days for the refund to appear in your account.
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <div className="bg-foreground/5 p-6 rounded-lg border border-foreground/10">
            <h2 className="text-xl font-bold text-foreground mb-4">Refund Policy</h2>
            <ul className="space-y-2">
              <li className="flex justify-between">
                <span>Original Payment Method</span>
                <span className="font-medium">Refunded</span>
              </li>
              <li className="flex justify-between">
                <span>Shipping Cost</span>
                <span className="font-medium">Non-refundable</span>
              </li>
              <li className="flex justify-between">
                <span>Return Shipping</span>
                <span className="font-medium">Customer pays</span>
              </li>
              <li className="flex justify-between">
                <span>Processing Time</span>
                <span className="font-medium">5-10 business days</span>
              </li>
            </ul>
          </div>

          <div className="bg-foreground/5 p-6 rounded-lg border border-foreground/10">
            <h2 className="text-xl font-bold text-foreground mb-4">Exchange Policy</h2>
            <ul className="space-y-2">
              <li className="flex justify-between">
                <span>Eligible Items</span>
                <span className="font-medium">Same product</span>
              </li>
              <li className="flex justify-between">
                <span>Size Exchanges</span>
                <span className="font-medium">Available</span>
              </li>
              <li className="flex justify-between">
                <span>Color Exchanges</span>
                <span className="font-medium">Subject to availability</span>
              </li>
              <li className="flex justify-between">
                <span>Additional Cost</span>
                <span className="font-medium">If applicable</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="bg-gold/10 p-6 rounded-lg border border-gold/20">
          <h2 className="text-xl font-bold text-foreground mb-3">Damaged or Defective Items</h2>
          <p className="text-foreground/80 mb-4">
            If you receive a damaged or defective item, please contact us within 48 hours of delivery. 
            We'll arrange for a replacement or full refund, including return shipping costs.
          </p>
          <p className="text-foreground/80">
            Please keep all original packaging and documentation when reporting damaged items.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ReturnsPage;