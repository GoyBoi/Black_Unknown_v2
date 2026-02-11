import React from 'react';

const CareInstructionsPage = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 md:px-10 py-16">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Care Instructions</h1>
          <p className="text-lg text-foreground/80 max-w-2xl mx-auto">
            Keep your handcrafted crochet items beautiful with these care guidelines.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <div className="bg-foreground/5 p-6 rounded-lg border border-foreground/10">
            <h2 className="text-xl font-bold text-foreground mb-4">General Care Tips</h2>
            <ul className="space-y-3">
              <li className="flex items-start">
                <span className="text-gold mr-2">•</span>
                <span>Always hand wash in cold water with mild detergent</span>
              </li>
              <li className="flex items-start">
                <span className="text-gold mr-2">•</span>
                <span>Lay flat to dry - never hang crochet items</span>
              </li>
              <li className="flex items-start">
                <span className="text-gold mr-2">•</span>
                <span>Avoid wringing or twisting which can damage fibers</span>
              </li>
              <li className="flex items-start">
                <span className="text-gold mr-2">•</span>
                <span>Store in a cool, dry place away from direct sunlight</span>
              </li>
              <li className="flex items-start">
                <span className="text-gold mr-2">•</span>
                <span>Keep away from pets that might chew on yarn</span>
              </li>
            </ul>
          </div>

          <div className="bg-foreground/5 p-6 rounded-lg border border-foreground/10">
            <h2 className="text-xl font-bold text-foreground mb-4">By Item Type</h2>
            <ul className="space-y-3">
              <li className="flex items-start">
                <span className="text-gold mr-2">•</span>
                <span><strong>Clothing:</strong> Reshape while damp</span>
              </li>
              <li className="flex items-start">
                <span className="text-gold mr-2">•</span>
                <span><strong>Dolls:</strong> Spot clean with damp cloth</span>
              </li>
              <li className="flex items-start">
                <span className="text-gold mr-2">•</span>
                <span><strong>Flowers:</strong> Gently dust with soft brush</span>
              </li>
              <li className="flex items-start">
                <span className="text-gold mr-2">•</span>
                <span><strong>Home Decor:</strong> Vacuum gently with brush attachment</span>
              </li>
              <li className="flex items-start">
                <span className="text-gold mr-2">•</span>
                <span><strong>Accessories:</strong> Steam lightly if needed</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mb-12">
          <h2 className="text-2xl font-bold text-foreground mb-6">Detailed Care Instructions</h2>
          
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-3">Washing Process</h3>
              <ol className="list-decimal pl-5 space-y-2">
                <li>Fill basin with cold water and add mild detergent</li>
                <li>Submerge item gently and agitate softly for 5 minutes</li>
                <li>Rinse thoroughly with cold water until water runs clear</li>
                <li>Press gently to remove excess water (do not wring)</li>
                <li>Roll in a clean towel to absorb moisture</li>
                <li>Lay flat on a dry towel in its natural shape</li>
              </ol>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-foreground mb-3">Stain Removal</h3>
              <p className="text-foreground/80 mb-3">
                For minor stains, spot clean with a mixture of cold water and mild detergent. 
                For tougher stains, soak the stained area for 15-30 minutes before washing as usual.
              </p>
              <p className="text-foreground/80">
                Avoid harsh chemicals like bleach or fabric softeners as they can damage the fibers.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-foreground mb-3">Storage Tips</h3>
              <p className="text-foreground/80">
                Store crochet items folded in a breathable fabric bag or drawer. 
                Add cedar blocks or lavender sachets to deter moths naturally. 
                Avoid plastic bags which can trap moisture and cause yellowing.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-gold/10 p-6 rounded-lg border border-gold/20">
          <h2 className="text-xl font-bold text-foreground mb-3">Special Notes</h2>
          <p className="text-foreground/80 mb-4">
            Our crochet items are lovingly handcrafted with premium yarns. 
            With proper care, they will remain beautiful for years to come.
          </p>
          <p className="text-foreground/80">
            If you have specific questions about caring for a particular item, 
            please contact our customer service team for personalized advice.
          </p>
        </div>
      </div>
    </div>
  );
};

export default CareInstructionsPage;