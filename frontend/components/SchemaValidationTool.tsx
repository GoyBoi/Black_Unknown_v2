// components/SchemaValidationTool.tsx
'use client';

import React, { useState } from 'react';
import { validateSchema, generateValidationReport, ValidationResult } from '@/lib/schema-validation';

const SchemaValidationTool = () => {
  const [schemaInput, setSchemaInput] = useState<string>('');
  const [validationResult, setValidationResult] = useState<ValidationResult | null>(null);
  const [report, setReport] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [options, setOptions] = useState({
    strictMode: false,
    validateRequiredFields: true,
    validateTypes: true,
    validateUrls: true,
    validateImages: true
  });

  const handleValidate = () => {
    setIsLoading(true);
    
    try {
      // Parse the schema input
      const parsedSchema = JSON.parse(schemaInput);
      
      // Validate the schema
      const result = validateSchema(parsedSchema, options);
      setValidationResult(result);
      
      // Generate report
      const generatedReport = generateValidationReport(parsedSchema, options);
      setReport(generatedReport);
    } catch (error: any) {
      setValidationResult({
        isValid: false,
        errors: [`Invalid JSON: ${error.message}`],
        warnings: [],
        suggestions: []
      });
      setReport(`Invalid JSON: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOptionChange = (option: keyof typeof options) => {
    setOptions(prev => ({
      ...prev,
      [option]: !prev[option]
    }));
  };

  const loadSampleSchema = (type: 'product' | 'organization') => {
    let sampleSchema = '';
    
    if (type === 'product') {
      sampleSchema = JSON.stringify({
        "@context": "https://schema.org/",
        "@type": "Product",
        "name": "MMWAFRIKA PRIDE Hand-knitted Cardigan",
        "image": [
          "https://example.com/cardigan1.jpg",
          "https://example.com/cardigan2.jpg"
        ],
        "description": "A beautiful hand-knitted cardigan made with premium yarns.",
        "sku": "CARDIGAN-001",
        "offers": {
          "@type": "Offer",
          "price": "890",
          "priceCurrency": "ZAR",
          "availability": "https://schema.org/InStock",
          "seller": {
            "@type": "Organization",
            "name": "MMWAFRIKA PRIDE"
          }
        },
        "brand": {
          "@type": "Brand",
          "name": "MMWAFRIKA PRIDE"
        }
      }, null, 2);
    } else if (type === 'organization') {
      sampleSchema = JSON.stringify({
        "@context": "https://schema.org",
        "@type": "Organization",
        "name": "MMWAFRIKA PRIDE",
        "url": "https://mmwafrika.com",
        "logo": "https://mmwafrika.com/logo.png",
        "sameAs": [
          "https://www.facebook.com/mmwafrika",
          "https://www.instagram.com/mmwafrika",
          "https://twitter.com/mmwafrika"
        ],
        "contactPoint": [
          {
            "@type": "ContactPoint",
            "telephone": "+27 12 345 6789",
            "contactType": "customer service",
            "areaServed": "ZA",
            "availableLanguage": "en"
          }
        ]
      }, null, 2);
    }
    
    setSchemaInput(sampleSchema);
  };

  return (
    <div className="bg-background text-foreground p-6 rounded-lg border border-foreground/10">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2">Schema Validation Tool</h2>
        <p className="text-foreground/80">
          Validate your structured data schemas to ensure they comply with schema.org standards
        </p>
      </div>

      {/* Options Panel */}
      <div className="mb-6 p-4 bg-foreground/5 rounded-lg border border-foreground/10">
        <h3 className="font-semibold mb-3">Validation Options</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={options.strictMode}
              onChange={() => handleOptionChange('strictMode')}
              className="mr-2"
            />
            Strict Mode
          </label>
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={options.validateRequiredFields}
              onChange={() => handleOptionChange('validateRequiredFields')}
              className="mr-2"
            />
            Validate Required Fields
          </label>
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={options.validateTypes}
              onChange={() => handleOptionChange('validateTypes')}
              className="mr-2"
            />
            Validate Types
          </label>
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={options.validateUrls}
              onChange={() => handleOptionChange('validateUrls')}
              className="mr-2"
            />
            Validate URLs
          </label>
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={options.validateImages}
              onChange={() => handleOptionChange('validateImages')}
              className="mr-2"
            />
            Validate Images
          </label>
        </div>
      </div>

      {/* Sample Schema Buttons */}
      <div className="mb-4 flex space-x-3">
        <button
          onClick={() => loadSampleSchema('product')}
          className="px-4 py-2 bg-foreground/10 hover:bg-foreground/20 rounded-lg text-sm"
        >
          Load Product Sample
        </button>
        <button
          onClick={() => loadSampleSchema('organization')}
          className="px-4 py-2 bg-foreground/10 hover:bg-foreground/20 rounded-lg text-sm"
        >
          Load Organization Sample
        </button>
        <button
          onClick={() => setSchemaInput('')}
          className="px-4 py-2 bg-foreground/10 hover:bg-foreground/20 rounded-lg text-sm"
        >
          Clear
        </button>
      </div>

      {/* Schema Input */}
      <div className="mb-6">
        <label className="block text-sm font-medium mb-2">JSON-LD Schema</label>
        <textarea
          value={schemaInput}
          onChange={(e) => setSchemaInput(e.target.value)}
          rows={15}
          className="w-full p-4 bg-foreground/5 border border-foreground/20 rounded-lg font-mono text-sm"
          placeholder='Paste your JSON-LD schema here...'
        />
      </div>

      {/* Validate Button */}
      <div className="mb-6">
        <button
          onClick={handleValidate}
          disabled={isLoading || !schemaInput.trim()}
          className={`px-6 py-3 rounded-lg font-medium ${
            isLoading || !schemaInput.trim()
              ? 'bg-foreground/20 text-foreground/50 cursor-not-allowed'
              : 'bg-gold text-black hover:bg-gold/90'
          }`}
        >
          {isLoading ? 'Validating...' : 'Validate Schema'}
        </button>
      </div>

      {/* Results */}
      {validationResult && (
        <div className="border border-foreground/20 rounded-lg overflow-hidden">
          <div className={`p-4 ${validationResult.isValid ? 'bg-green-500/10' : 'bg-red-500/10'}`}>
            <div className="flex items-center">
              <div className={`w-3 h-3 rounded-full mr-2 ${validationResult.isValid ? 'bg-green-500' : 'bg-red-500'}`}></div>
              <h3 className="font-bold">
                {validationResult.isValid ? 'VALID SCHEMA' : 'INVALID SCHEMA'}
              </h3>
            </div>
          </div>

          <div className="p-4">
            {/* Errors */}
            {validationResult.errors.length > 0 && (
              <div className="mb-6">
                <h4 className="font-semibold text-red-500 mb-2">Errors ({validationResult.errors.length})</h4>
                <ul className="list-disc pl-5 space-y-1">
                  {validationResult.errors.map((error, index) => (
                    <li key={index} className="text-red-500">{error}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Warnings */}
            {validationResult.warnings.length > 0 && (
              <div className="mb-6">
                <h4 className="font-semibold text-yellow-500 mb-2">Warnings ({validationResult.warnings.length})</h4>
                <ul className="list-disc pl-5 space-y-1">
                  {validationResult.warnings.map((warning, index) => (
                    <li key={index} className="text-yellow-500">{warning}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Suggestions */}
            {validationResult.suggestions.length > 0 && (
              <div className="mb-6">
                <h4 className="font-semibold text-blue-500 mb-2">Suggestions ({validationResult.suggestions.length})</h4>
                <ul className="list-disc pl-5 space-y-1">
                  {validationResult.suggestions.map((suggestion, index) => (
                    <li key={index} className="text-blue-500">{suggestion}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Full Report */}
            <div>
              <h4 className="font-semibold mb-2">Full Validation Report</h4>
              <pre className="bg-foreground/5 p-4 rounded text-sm overflow-x-auto max-h-96 overflow-y-auto">
                {report}
              </pre>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SchemaValidationTool;