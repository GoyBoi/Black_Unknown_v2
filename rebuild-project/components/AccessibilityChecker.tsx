// components/AccessibilityChecker.tsx
'use client';

import { useEffect, useState } from 'react';
import { isValidContrast, validateAriaAttributes } from '@/lib/accessibility';

interface AccessibilityIssue {
  element: Element;
  message: string;
  severity: 'error' | 'warning' | 'info';
}

const AccessibilityChecker = () => {
  const [issues, setIssues] = useState<AccessibilityIssue[]>([]);
  const [isEnabled, setIsEnabled] = useState(false);

  // Function to run accessibility audit
  const runAudit = () => {
    if (!isEnabled) return;

    const newIssues: AccessibilityIssue[] = [];

    // Check for missing alt attributes on images
    const images = document.querySelectorAll('img');
    images.forEach(img => {
      if (!img.hasAttribute('alt')) {
        newIssues.push({
          element: img,
          message: 'Image missing alt attribute',
          severity: 'error'
        });
      } else if (img.getAttribute('alt') === '') {
        // Check if decorative image has aria-hidden
        if (!img.hasAttribute('aria-hidden')) {
          newIssues.push({
            element: img,
            message: 'Decorative image should have aria-hidden="true"',
            severity: 'warning'
          });
        }
      }
    });

    // Check for sufficient color contrast
    const elementsWithText = document.querySelectorAll('*');
    elementsWithText.forEach(el => {
      const computedStyle = window.getComputedStyle(el);
      const bgColor = computedStyle.backgroundColor;
      const textColor = computedStyle.color;
      
      if (bgColor !== 'rgba(0, 0, 0, 0)' && textColor !== 'rgba(0, 0, 0, 0)') {
        if (!isValidContrast(bgColor, textColor)) {
          newIssues.push({
            element: el,
            message: 'Insufficient color contrast',
            severity: 'error'
          });
        }
      }
    });

    // Check for proper heading hierarchy
    const allHeadings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
    let lastLevel = 0;
    allHeadings.forEach(heading => {
      const currentLevel = parseInt(heading.tagName.charAt(1));
      if (currentLevel > lastLevel + 1) {
        newIssues.push({
          element: heading,
          message: `Heading level skipped from H${lastLevel} to H${currentLevel}`,
          severity: 'warning'
        });
      }
      lastLevel = currentLevel;
    });

    // Check for ARIA attributes
    // Select elements with role attribute or any aria-* attribute
    const allElements = Array.from(document.querySelectorAll('*')).filter(el => {
      return el.hasAttribute('role') || 
             Array.from(el.attributes).some(attr => attr.name.startsWith('aria-'));
    });
    
    allElements.forEach(el => {
      const ariaErrors = validateAriaAttributes(el as HTMLElement);
      ariaErrors.forEach(error => {
        newIssues.push({
          element: el,
          message: error,
          severity: 'error'
        });
      });
    });

    setIssues(newIssues);
  };

  useEffect(() => {
    if (isEnabled) {
      // Run initial audit
      runAudit();

      // Set up mutation observer to detect changes
      const observer = new MutationObserver(runAudit);
      observer.observe(document.body, {
        childList: true,
        subtree: true,
        attributes: true
      });

      // Run audit periodically
      const interval = setInterval(runAudit, 5000);

      return () => {
        observer.disconnect();
        clearInterval(interval);
      };
    }
  }, [isEnabled]);

  if (!isEnabled) {
    return (
      <button
        onClick={() => setIsEnabled(true)}
        className="fixed bottom-4 right-4 bg-gold text-black px-4 py-2 rounded-lg z-50 shadow-lg"
      >
        Enable Accessibility Checker
      </button>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 bg-white text-black p-4 rounded-lg shadow-xl z-50 max-w-md max-h-96 overflow-auto border-2 border-gold">
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-bold">Accessibility Issues ({issues.length})</h3>
        <button
          onClick={() => setIsEnabled(false)}
          className="text-red-600 hover:text-red-800"
        >
          Close
        </button>
      </div>
      
      {issues.length === 0 ? (
        <p className="text-green-600">No accessibility issues found!</p>
      ) : (
        <ul className="space-y-2">
          {issues.map((issue, index) => (
            <li 
              key={index} 
              className={`p-2 rounded text-sm ${
                issue.severity === 'error' ? 'bg-red-100 text-red-800' :
                issue.severity === 'warning' ? 'bg-yellow-100 text-yellow-800' :
                'bg-blue-100 text-blue-800'
              }`}
              onClick={() => {
                issue.element.scrollIntoView({ behavior: 'smooth', block: 'center' });
                (issue.element as HTMLElement).focus();
              }}
            >
              <span className="font-medium">{issue.message}</span>
              <br />
              <span className="text-xs">Click to highlight element</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AccessibilityChecker;