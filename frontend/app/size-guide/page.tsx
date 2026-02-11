import React from 'react';

const SizeGuidePage = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 md:px-10 py-16">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Size Guide</h1>
          <p className="text-lg text-foreground/80 max-w-2xl mx-auto">
            Find your perfect fit with our comprehensive size guide for crochet clothing items.
          </p>
        </div>

        <div className="bg-foreground/5 p-6 rounded-lg border border-foreground/10 mb-12">
          <h2 className="text-xl font-bold text-foreground mb-4">How to Measure</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="bg-white/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl">1</span>
              </div>
              <h3 className="font-semibold text-foreground mb-2">Bust</h3>
              <p className="text-sm text-foreground/80">Measure around the fullest part of your bust, keeping the tape parallel to the floor.</p>
            </div>
            <div className="text-center">
              <div className="bg-white/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl">2</span>
              </div>
              <h3 className="font-semibold text-foreground mb-2">Waist</h3>
              <p className="text-sm text-foreground/80">Measure around your natural waistline, keeping the tape comfortably loose.</p>
            </div>
            <div className="text-center">
              <div className="bg-white/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl">3</span>
              </div>
              <h3 className="font-semibold text-foreground mb-2">Hips</h3>
              <p className="text-sm text-foreground/80">Measure around the fullest part of your hips, keeping the tape parallel to the floor.</p>
            </div>
          </div>
        </div>

        <div className="mb-12">
          <h2 className="text-2xl font-bold text-foreground mb-6">Women's Clothing Size Chart</h2>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-foreground/20">
              <thead>
                <tr className="bg-foreground/5">
                  <th className="border border-foreground/20 p-4 text-left">Size</th>
                  <th className="border border-foreground/20 p-4 text-left">XS</th>
                  <th className="border border-foreground/20 p-4 text-left">S</th>
                  <th className="border border-foreground/20 p-4 text-left">M</th>
                  <th className="border border-foreground/20 p-4 text-left">L</th>
                  <th className="border border-foreground/20 p-4 text-left">XL</th>
                  <th className="border border-foreground/20 p-4 text-left">XXL</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-foreground/20 p-4 font-medium">Bust (inches)</td>
                  <td className="border border-foreground/20 p-4">32</td>
                  <td className="border border-foreground/20 p-4">34</td>
                  <td className="border border-foreground/20 p-4">36</td>
                  <td className="border border-foreground/20 p-4">38</td>
                  <td className="border border-foreground/20 p-4">40</td>
                  <td className="border border-foreground/20 p-4">42</td>
                </tr>
                <tr className="bg-foreground/5">
                  <td className="border border-foreground/20 p-4 font-medium">Bust (cm)</td>
                  <td className="border border-foreground/20 p-4">81</td>
                  <td className="border border-foreground/20 p-4">86</td>
                  <td className="border border-foreground/20 p-4">91</td>
                  <td className="border border-foreground/20 p-4">97</td>
                  <td className="border border-foreground/20 p-4">102</td>
                  <td className="border border-foreground/20 p-4">107</td>
                </tr>
                <tr>
                  <td className="border border-foreground/20 p-4 font-medium">Waist (inches)</td>
                  <td className="border border-foreground/20 p-4">24</td>
                  <td className="border border-foreground/20 p-4">26</td>
                  <td className="border border-foreground/20 p-4">28</td>
                  <td className="border border-foreground/20 p-4">30</td>
                  <td className="border border-foreground/20 p-4">32</td>
                  <td className="border border-foreground/20 p-4">34</td>
                </tr>
                <tr className="bg-foreground/5">
                  <td className="border border-foreground/20 p-4 font-medium">Waist (cm)</td>
                  <td className="border border-foreground/20 p-4">61</td>
                  <td className="border border-foreground/20 p-4">66</td>
                  <td className="border border-foreground/20 p-4">71</td>
                  <td className="border border-foreground/20 p-4">76</td>
                  <td className="border border-foreground/20 p-4">81</td>
                  <td className="border border-foreground/20 p-4">86</td>
                </tr>
                <tr>
                  <td className="border border-foreground/20 p-4 font-medium">Hips (inches)</td>
                  <td className="border border-foreground/20 p-4">34</td>
                  <td className="border border-foreground/20 p-4">36</td>
                  <td className="border border-foreground/20 p-4">38</td>
                  <td className="border border-foreground/20 p-4">40</td>
                  <td className="border border-foreground/20 p-4">42</td>
                  <td className="border border-foreground/20 p-4">44</td>
                </tr>
                <tr className="bg-foreground/5">
                  <td className="border border-foreground/20 p-4 font-medium">Hips (cm)</td>
                  <td className="border border-foreground/20 p-4">86</td>
                  <td className="border border-foreground/20 p-4">91</td>
                  <td className="border border-foreground/20 p-4">97</td>
                  <td className="border border-foreground/20 p-4">102</td>
                  <td className="border border-foreground/20 p-4">107</td>
                  <td className="border border-foreground/20 p-4">112</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="mb-12">
          <h2 className="text-2xl font-bold text-foreground mb-6">Men's Clothing Size Chart</h2>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-foreground/20">
              <thead>
                <tr className="bg-foreground/5">
                  <th className="border border-foreground/20 p-4 text-left">Size</th>
                  <th className="border border-foreground/20 p-4 text-left">S</th>
                  <th className="border border-foreground/20 p-4 text-left">M</th>
                  <th className="border border-foreground/20 p-4 text-left">L</th>
                  <th className="border border-foreground/20 p-4 text-left">XL</th>
                  <th className="border border-foreground/20 p-4 text-left">XXL</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-foreground/20 p-4 font-medium">Chest (inches)</td>
                  <td className="border border-foreground/20 p-4">36</td>
                  <td className="border border-foreground/20 p-4">38</td>
                  <td className="border border-foreground/20 p-4">40</td>
                  <td className="border border-foreground/20 p-4">42</td>
                  <td className="border border-foreground/20 p-4">44</td>
                </tr>
                <tr className="bg-foreground/5">
                  <td className="border border-foreground/20 p-4 font-medium">Chest (cm)</td>
                  <td className="border border-foreground/20 p-4">91</td>
                  <td className="border border-foreground/20 p-4">97</td>
                  <td className="border border-foreground/20 p-4">102</td>
                  <td className="border border-foreground/20 p-4">107</td>
                  <td className="border border-foreground/20 p-4">112</td>
                </tr>
                <tr>
                  <td className="border border-foreground/20 p-4 font-medium">Waist (inches)</td>
                  <td className="border border-foreground/20 p-4">30</td>
                  <td className="border border-foreground/20 p-4">32</td>
                  <td className="border border-foreground/20 p-4">34</td>
                  <td className="border border-foreground/20 p-4">36</td>
                  <td className="border border-foreground/20 p-4">38</td>
                </tr>
                <tr className="bg-foreground/5">
                  <td className="border border-foreground/20 p-4 font-medium">Waist (cm)</td>
                  <td className="border border-foreground/20 p-4">76</td>
                  <td className="border border-foreground/20 p-4">81</td>
                  <td className="border border-foreground/20 p-4">86</td>
                  <td className="border border-foreground/20 p-4">91</td>
                  <td className="border border-foreground/20 p-4">97</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-gold/10 p-6 rounded-lg border border-gold/20">
          <h2 className="text-xl font-bold text-foreground mb-3">Important Notes</h2>
          <ul className="list-disc pl-5 space-y-2 text-foreground/80">
            <li>Measure yourself while wearing minimal clothing for accuracy</li>
            <li>All measurements are taken while the garment is lying flat</li>
            <li>Due to the handmade nature of our crochet items, there may be slight variations in sizing</li>
            <li>When in doubt between sizes, we recommend sizing up for a comfortable fit</li>
            <li>Each product page includes specific measurements for that item</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default SizeGuidePage;