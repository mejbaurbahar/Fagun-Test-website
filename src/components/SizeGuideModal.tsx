import React, { useState } from 'react';
import { X, Ruler, Check, HelpCircle } from 'lucide-react';
import { trackMtag } from '../utils/analytics';

interface SizeGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialCategory?: 'Clothing' | 'Footwear' | 'Accessories';
}

export const SizeGuideModal: React.FC<SizeGuideModalProps> = ({
  isOpen,
  onClose,
  initialCategory = 'Clothing'
}) => {
  if (!isOpen) return null;

  const [activeCategory, setActiveCategory] = useState<'Clothing' | 'Footwear' | 'Accessories'>(
    initialCategory === 'Footwear' || initialCategory === 'Accessories' ? initialCategory : 'Clothing'
  );
  const [unit, setUnit] = useState<'in' | 'cm'>('in');

  const handleTabChange = (cat: 'Clothing' | 'Footwear' | 'Accessories') => {
    setActiveCategory(cat);
    trackMtag('ViewSizeGuideCategory', { category: cat, unit });
  };

  const handleUnitToggle = (newUnit: 'in' | 'cm') => {
    setUnit(newUnit);
    trackMtag('ChangeSizeGuideUnit', { unit: newUnit, category: activeCategory });
  };

  // Convert Inches to CM if needed
  const formatVal = (inVal: string, cmVal: string) => (unit === 'in' ? inVal : cmVal);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
      {/* Background overlay click to close */}
      <div className="fixed inset-0" onClick={onClose} />

      {/* Modal Container */}
      <div className="relative w-full max-w-2xl bg-neutral-900 border border-neutral-800 rounded-xl shadow-2xl overflow-hidden z-10 my-8">
        
        {/* Modal Header */}
        <div className="p-5 border-b border-neutral-800 flex items-center justify-between bg-neutral-950/80">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-[var(--accent-lime)]/10 text-[var(--accent-lime)] rounded-lg">
              <Ruler className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif text-xl text-white font-medium">Size & Fit Guide</h3>
              <p className="text-xs text-neutral-400">Find your perfect Fagun Atelier tailored fit</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-neutral-400 hover:text-white rounded-full hover:bg-neutral-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Category Tabs & Unit Switcher */}
        <div className="px-6 py-4 border-b border-neutral-800 bg-neutral-900 flex flex-wrap items-center justify-between gap-3">
          
          {/* Category Tabs */}
          <div className="flex items-center bg-neutral-950 p-1 rounded-lg border border-neutral-800">
            {(['Clothing', 'Footwear', 'Accessories'] as const).map((cat) => (
              <button
                key={cat}
                onClick={() => handleTabChange(cat)}
                className={`px-4 py-1.5 text-xs font-medium rounded-md transition-all ${
                  activeCategory === cat
                    ? 'bg-[var(--accent-lime)] text-[var(--accent-lime-ink)] font-semibold shadow'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Unit Toggle */}
          <div className="flex items-center gap-2 text-xs text-neutral-400">
            <span>Unit:</span>
            <div className="flex bg-neutral-950 p-1 rounded-lg border border-neutral-800 font-mono">
              <button
                onClick={() => handleUnitToggle('in')}
                className={`px-2.5 py-1 rounded text-xs transition-colors ${
                  unit === 'in' ? 'bg-neutral-800 text-white font-bold' : 'text-neutral-400 hover:text-white'
                }`}
              >
                IN
              </button>
              <button
                onClick={() => handleUnitToggle('cm')}
                className={`px-2.5 py-1 rounded text-xs transition-colors ${
                  unit === 'cm' ? 'bg-neutral-800 text-white font-bold' : 'text-neutral-400 hover:text-white'
                }`}
              >
                CM
              </button>
            </div>
          </div>

        </div>

        {/* Modal Content / Sizing Tables */}
        <div className="p-6 space-y-6 max-h-[65vh] overflow-y-auto">

          {/* CLOTHING SIZE CHART */}
          {activeCategory === 'Clothing' && (
            <div className="space-y-4">
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left text-neutral-300">
                  <thead className="text-[11px] uppercase font-mono text-neutral-400 bg-neutral-950 border-b border-neutral-800">
                    <tr>
                      <th className="py-3 px-4">Size</th>
                      <th className="py-3 px-4">US / CAN</th>
                      <th className="py-3 px-4">UK / AUS</th>
                      <th className="py-3 px-4">EU</th>
                      <th className="py-3 px-4">Bust ({unit})</th>
                      <th className="py-3 px-4">Waist ({unit})</th>
                      <th className="py-3 px-4">Hips ({unit})</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-800/60 font-mono">
                    <tr className="hover:bg-neutral-800/40">
                      <td className="py-3 px-4 font-sans font-bold text-white">XS</td>
                      <td className="py-3 px-4">0 - 2</td>
                      <td className="py-3 px-4">4 - 6</td>
                      <td className="py-3 px-4">32 - 34</td>
                      <td className="py-3 px-4">{formatVal('31 - 32.5"', '79 - 83 cm')}</td>
                      <td className="py-3 px-4">{formatVal('24 - 25.5"', '61 - 65 cm')}</td>
                      <td className="py-3 px-4">{formatVal('34 - 35.5"', '86 - 90 cm')}</td>
                    </tr>
                    <tr className="hover:bg-neutral-800/40">
                      <td className="py-3 px-4 font-sans font-bold text-white">S</td>
                      <td className="py-3 px-4">4 - 6</td>
                      <td className="py-3 px-4">8 - 10</td>
                      <td className="py-3 px-4">36 - 38</td>
                      <td className="py-3 px-4">{formatVal('33 - 34.5"', '84 - 88 cm')}</td>
                      <td className="py-3 px-4">{formatVal('26 - 27.5"', '66 - 70 cm')}</td>
                      <td className="py-3 px-4">{formatVal('36 - 37.5"', '91 - 95 cm')}</td>
                    </tr>
                    <tr className="hover:bg-neutral-800/40 bg-neutral-950/40">
                      <td className="py-3 px-4 font-sans font-bold text-[var(--accent-lime)]">M</td>
                      <td className="py-3 px-4">8 - 10</td>
                      <td className="py-3 px-4">12 - 14</td>
                      <td className="py-3 px-4">40 - 42</td>
                      <td className="py-3 px-4">{formatVal('35 - 36.5"', '89 - 93 cm')}</td>
                      <td className="py-3 px-4">{formatVal('28 - 29.5"', '71 - 75 cm')}</td>
                      <td className="py-3 px-4">{formatVal('38 - 39.5"', '96 - 100 cm')}</td>
                    </tr>
                    <tr className="hover:bg-neutral-800/40">
                      <td className="py-3 px-4 font-sans font-bold text-white">L</td>
                      <td className="py-3 px-4">12 - 14</td>
                      <td className="py-3 px-4">16 - 18</td>
                      <td className="py-3 px-4">44 - 46</td>
                      <td className="py-3 px-4">{formatVal('37 - 39"', '94 - 99 cm')}</td>
                      <td className="py-3 px-4">{formatVal('30 - 32"', '76 - 81 cm')}</td>
                      <td className="py-3 px-4">{formatVal('40 - 42"', '101 - 107 cm')}</td>
                    </tr>
                    <tr className="hover:bg-neutral-800/40">
                      <td className="py-3 px-4 font-sans font-bold text-white">XL</td>
                      <td className="py-3 px-4">16</td>
                      <td className="py-3 px-4">20</td>
                      <td className="py-3 px-4">48</td>
                      <td className="py-3 px-4">{formatVal('40 - 42"', '102 - 107 cm')}</td>
                      <td className="py-3 px-4">{formatVal('33 - 35"', '84 - 89 cm')}</td>
                      <td className="py-3 px-4">{formatVal('43 - 45"', '109 - 114 cm')}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* FOOTWEAR SIZE CHART */}
          {activeCategory === 'Footwear' && (
            <div className="space-y-4">
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left text-neutral-300">
                  <thead className="text-[11px] uppercase font-mono text-neutral-400 bg-neutral-950 border-b border-neutral-800">
                    <tr>
                      <th className="py-3 px-4">US Size</th>
                      <th className="py-3 px-4">UK Size</th>
                      <th className="py-3 px-4">EU Size</th>
                      <th className="py-3 px-4">Japan (cm)</th>
                      <th className="py-3 px-4">Foot Length ({unit})</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-800/60 font-mono">
                    <tr className="hover:bg-neutral-800/40">
                      <td className="py-3 px-4 font-sans font-bold text-white">US 6</td>
                      <td className="py-3 px-4">3.5</td>
                      <td className="py-3 px-4">36.5</td>
                      <td className="py-3 px-4">23.0</td>
                      <td className="py-3 px-4">{formatVal('9.0"', '22.9 cm')}</td>
                    </tr>
                    <tr className="hover:bg-neutral-800/40">
                      <td className="py-3 px-4 font-sans font-bold text-white">US 7</td>
                      <td className="py-3 px-4">4.5</td>
                      <td className="py-3 px-4">37.5</td>
                      <td className="py-3 px-4">24.0</td>
                      <td className="py-3 px-4">{formatVal('9.3"', '23.8 cm')}</td>
                    </tr>
                    <tr className="hover:bg-neutral-800/40 bg-neutral-950/40">
                      <td className="py-3 px-4 font-sans font-bold text-[var(--accent-lime)]">US 8</td>
                      <td className="py-3 px-4">5.5</td>
                      <td className="py-3 px-4">38.5</td>
                      <td className="py-3 px-4">25.0</td>
                      <td className="py-3 px-4">{formatVal('9.7"', '24.6 cm')}</td>
                    </tr>
                    <tr className="hover:bg-neutral-800/40">
                      <td className="py-3 px-4 font-sans font-bold text-white">US 9</td>
                      <td className="py-3 px-4">6.5</td>
                      <td className="py-3 px-4">39.5</td>
                      <td className="py-3 px-4">26.0</td>
                      <td className="py-3 px-4">{formatVal('10.0"', '25.4 cm')}</td>
                    </tr>
                    <tr className="hover:bg-neutral-800/40">
                      <td className="py-3 px-4 font-sans font-bold text-white">US 10</td>
                      <td className="py-3 px-4">7.5</td>
                      <td className="py-3 px-4">40.5</td>
                      <td className="py-3 px-4">27.0</td>
                      <td className="py-3 px-4">{formatVal('10.3"', '26.2 cm')}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ACCESSORIES SIZE CHART */}
          {activeCategory === 'Accessories' && (
            <div className="space-y-4">
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left text-neutral-300">
                  <thead className="text-[11px] uppercase font-mono text-neutral-400 bg-neutral-950 border-b border-neutral-800">
                    <tr>
                      <th className="py-3 px-4">Item Type</th>
                      <th className="py-3 px-4">Standard Size</th>
                      <th className="py-3 px-4">Waist / Circumference ({unit})</th>
                      <th className="py-3 px-4">Fit Notes</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-800/60 font-mono">
                    <tr className="hover:bg-neutral-800/40">
                      <td className="py-3 px-4 font-sans font-bold text-white">Leather Belts</td>
                      <td className="py-3 px-4">S (30 - 32)</td>
                      <td className="py-3 px-4">{formatVal('30 - 32"', '76 - 81 cm')}</td>
                      <td className="py-3 px-4 text-neutral-400">Fits natural waist line</td>
                    </tr>
                    <tr className="hover:bg-neutral-800/40">
                      <td className="py-3 px-4 font-sans font-bold text-white">Leather Belts</td>
                      <td className="py-3 px-4">M (34 - 36)</td>
                      <td className="py-3 px-4">{formatVal('34 - 36"', '86 - 91 cm')}</td>
                      <td className="py-3 px-4 text-neutral-400">Standard mid-rise fit</td>
                    </tr>
                    <tr className="hover:bg-neutral-800/40">
                      <td className="py-3 px-4 font-sans font-bold text-white">Artisanal Rings</td>
                      <td className="py-3 px-4">Size 6 / 7 / 8</td>
                      <td className="py-3 px-4">{formatVal('0.65 - 0.72"', '16.5 - 18.2 mm')}</td>
                      <td className="py-3 px-4 text-neutral-400">Inner ring diameter</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Measuring Guide Explanation Box */}
          <div className="bg-neutral-950 border border-neutral-800 rounded-lg p-4 space-y-3">
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider flex items-center gap-1.5">
              <HelpCircle className="w-4 h-4 text-[var(--accent-lime)]" />
              <span>How to Measure</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-[11px] text-neutral-400">
              <div className="space-y-1">
                <span className="text-white font-medium block">1. Bust / Chest</span>
                <p>Measure around the fullest part of your chest, keeping the tape horizontal.</p>
              </div>
              <div className="space-y-1">
                <span className="text-white font-medium block">2. Natural Waist</span>
                <p>Measure around your narrowest waistline point, usually right above your navel.</p>
              </div>
              <div className="space-y-1">
                <span className="text-white font-medium block">3. Fullest Hips</span>
                <p>Stand with feet together and measure around the fullest part of your hip line.</p>
              </div>
            </div>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-neutral-800 bg-neutral-950 flex items-center justify-between">
          <p className="text-[11px] text-neutral-400 flex items-center gap-1">
            <Check className="w-3.5 h-3.5 text-[var(--accent-lime)]" />
            <span>Need personalized tailoring advice? Contact Concierge</span>
          </p>

          <button
            onClick={onClose}
            className="bg-neutral-800 hover:bg-neutral-700 text-white text-xs px-4 py-2 rounded-md font-medium transition-colors"
          >
            Close Guide
          </button>
        </div>

      </div>
    </div>
  );
};
