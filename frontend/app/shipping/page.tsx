import React from 'react';

const ShippingPage = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 md:px-10 py-16">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Shipping Information</h1>
          <p className="text-lg text-foreground/80 max-w-2xl mx-auto">
            Learn about our shipping options, rates, and delivery times.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <div className="bg-foreground/5 p-6 rounded-lg border border-foreground/10">
            <h2 className="text-xl font-bold text-foreground mb-4">Domestic Shipping</h2>
            <ul className="space-y-3">
              <li className="flex justify-between">
                <span>Standard Shipping</span>
                <span className="font-medium">R95 (3-5 days)</span>
              </li>
              <li className="flex justify-between">
                <span>Express Shipping</span>
                <span className="font-medium">R150 (1-2 days)</span>
              </li>
              <li className="flex justify-between">
                <span>Free Shipping</span>
                <span className="font-medium">Orders over R1500</span>
              </li>
            </ul>
          </div>

          <div className="bg-foreground/5 p-6 rounded-lg border border-foreground/10">
            <h2 className="text-xl font-bold text-foreground mb-4">International Shipping</h2>
            <ul className="space-y-3">
              <li className="flex justify-between">
                <span>Standard International</span>
                <span className="font-medium">R250 (7-14 days)</span>
              </li>
              <li className="flex justify-between">
                <span>Express International</span>
                <span className="font-medium">R450 (5-10 days)</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mb-12">
          <h2 className="text-2xl font-bold text-foreground mb-6">Shipping Policies</h2>
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-2">Processing Time</h3>
              <p className="text-foreground/80">
                Orders are typically processed within 1-2 business days. You will receive a confirmation email once your order ships.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-2">Tracking Information</h3>
              <p className="text-foreground/80">
                Once your order ships, you'll receive an email with tracking information. You can also log into your account to view your order status.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-2">Delivery Areas</h3>
              <p className="text-foreground/80">
                We ship to all areas within South Africa and internationally. Some remote areas may require additional shipping time.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-2">Shipping Restrictions</h3>
              <p className="text-foreground/80">
                We cannot ship to PO Boxes. A physical address is required for all deliveries. International shipments may be subject to customs duties and taxes.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-gold/10 p-6 rounded-lg border border-gold/20">
          <h2 className="text-xl font-bold text-foreground mb-3">Special Shipping Instructions</h2>
          <p className="text-foreground/80 mb-4">
            If you need your order delivered by a specific date, please contact us before placing your order. 
            We'll do our best to accommodate your request, though additional expedited shipping fees may apply.
          </p>
          <p className="text-foreground/80">
            For international orders, please note that delivery times are estimates and may be affected by customs processing.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ShippingPage;