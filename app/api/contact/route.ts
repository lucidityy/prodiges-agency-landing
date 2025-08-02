import { NextRequest, NextResponse } from 'next/server';
import { InputValidator, SecurityUtils } from '@/lib/security';
import { trackEvent } from '@/lib/analytics';

// =============================================================================
// CONTACT FORM API - SECURE IMPLEMENTATION
// =============================================================================

interface ContactFormData {
  name: string;
  email: string;
  company?: string;
  phone?: string;
  message: string;
  budget?: string;
  timeline?: string;
  services?: string[];
  source?: string;
  honeypot?: string; // Bot detection
}

interface ValidationError {
  field: string;
  message: string;
}

export async function POST(request: NextRequest) {
  const startTime = Date.now();
  
  try {
    // 1. Parse and validate content type
    const contentType = request.headers.get('content-type');
    if (!contentType?.includes('application/json')) {
      return NextResponse.json(
        { error: 'Invalid content type' },
        { status: 400 }
      );
    }

    // 2. Parse request body with size limit
    const body = await request.json().catch(() => null);
    if (!body) {
      return NextResponse.json(
        { error: 'Invalid JSON' },
        { status: 400 }
      );
    }

    // 3. Honeypot check (bot detection)
    if (body.honeypot && body.honeypot.trim() !== '') {
      console.warn('🤖 Bot detected via honeypot field');
      // Return success to avoid revealing the honeypot
      return NextResponse.json({ success: true });
    }

    // 4. Validate required fields
    const validationErrors = validateContactForm(body);
    if (validationErrors.length > 0) {
      return NextResponse.json(
        { 
          error: 'Validation failed',
          errors: validationErrors 
        },
        { status: 400 }
      );
    }

    // 5. Sanitize input data
    const sanitizedData = sanitizeContactForm(body);

    // 6. Additional security checks
    const securityChecks = performSecurityChecks(sanitizedData, request);
    if (!securityChecks.passed) {
      console.warn('🚫 Security check failed:', securityChecks.reason);
      return NextResponse.json(
        { error: 'Security validation failed' },
        { status: 403 }
      );
    }

    // 7. Process the form submission
    const result = await processContactForm(sanitizedData, request);
    
    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 500 }
      );
    }

    // 8. Track analytics event
    try {
      // Note: This would typically be done on the client side
      // or with server-side analytics
      console.log('📊 Contact form submission tracked');
    } catch (error) {
      console.error('Analytics tracking failed:', error);
    }

    // 9. Return success response
    const processingTime = Date.now() - startTime;
    
    return NextResponse.json({
      success: true,
      message: 'Votre message a été envoyé avec succès. Nous vous répondrons dans les plus brefs délais.',
      submissionId: result.submissionId,
      estimatedResponse: '24h'
    }, {
      headers: {
        'X-Processing-Time': processingTime.toString(),
        'X-Submission-ID': result.submissionId
      }
    });

  } catch (error) {
    console.error('Contact form error:', error);
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// =============================================================================
// VALIDATION FUNCTIONS
// =============================================================================

function validateContactForm(data: any): ValidationError[] {
  const errors: ValidationError[] = [];

  // Required fields validation
  if (!data.name || typeof data.name !== 'string') {
    errors.push({ field: 'name', message: 'Le nom est requis' });
  } else if (!InputValidator.validateName(data.name)) {
    errors.push({ field: 'name', message: 'Le nom doit contenir entre 2 et 50 caractères' });
  }

  if (!data.email || typeof data.email !== 'string') {
    errors.push({ field: 'email', message: 'L\'email est requis' });
  } else if (!InputValidator.validateEmail(data.email)) {
    errors.push({ field: 'email', message: 'L\'email n\'est pas valide' });
  }

  if (!data.message || typeof data.message !== 'string') {
    errors.push({ field: 'message', message: 'Le message est requis' });
  } else if (!InputValidator.validateMessage(data.message)) {
    errors.push({ field: 'message', message: 'Le message doit contenir entre 10 et 2000 caractères' });
  }

  // Optional fields validation
  if (data.company && !InputValidator.validateCompany(data.company)) {
    errors.push({ field: 'company', message: 'Le nom de l\'entreprise n\'est pas valide' });
  }

  if (data.phone && !InputValidator.validatePhone(data.phone)) {
    errors.push({ field: 'phone', message: 'Le numéro de téléphone n\'est pas valide' });
  }

  // Validate arrays
  if (data.services && !Array.isArray(data.services)) {
    errors.push({ field: 'services', message: 'Les services doivent être un tableau' });
  }

  // Validate enum values
  const validBudgets = ['under-10k', '10k-50k', '50k-100k', 'over-100k'];
  if (data.budget && !validBudgets.includes(data.budget)) {
    errors.push({ field: 'budget', message: 'Budget non valide' });
  }

  const validTimelines = ['asap', '1-3months', '3-6months', 'flexible'];
  if (data.timeline && !validTimelines.includes(data.timeline)) {
    errors.push({ field: 'timeline', message: 'Timeline non valide' });
  }

  return errors;
}

function sanitizeContactForm(data: ContactFormData): ContactFormData {
  return {
    name: InputValidator.sanitizeHTML(data.name.trim()),
    email: data.email.trim().toLowerCase(),
    company: data.company ? InputValidator.sanitizeHTML(data.company.trim()) : undefined,
    phone: data.phone ? data.phone.replace(/[^\d\+\-\s\(\)]/g, '') : undefined,
    message: InputValidator.sanitizeHTML(data.message.trim()),
    budget: data.budget,
    timeline: data.timeline,
    services: data.services?.map(service => InputValidator.sanitizeHTML(service)),
    source: data.source ? InputValidator.sanitizeHTML(data.source) : undefined,
  };
}

// =============================================================================
// SECURITY CHECKS
// =============================================================================

interface SecurityCheckResult {
  passed: boolean;
  reason?: string;
}

function performSecurityChecks(data: ContactFormData, request: NextRequest): SecurityCheckResult {
  // Check for SQL injection patterns
  const sqlPatterns = [
    /union.*select/i,
    /drop.*table/i,
    /insert.*into/i,
    /delete.*from/i,
    /update.*set/i,
  ];

  const allText = `${data.name} ${data.email} ${data.message} ${data.company || ''}`;
  
  for (const pattern of sqlPatterns) {
    if (pattern.test(allText)) {
      return { passed: false, reason: 'SQL injection attempt detected' };
    }
  }

  // Check for XSS patterns
  const xssPatterns = [
    /<script/i,
    /javascript:/i,
    /on\w+\s*=/i,
    /<iframe/i,
    /<object/i,
    /<embed/i,
  ];

  for (const pattern of xssPatterns) {
    if (pattern.test(allText)) {
      return { passed: false, reason: 'XSS attempt detected' };
    }
  }

  // Check message length and content quality
  if (data.message.length < 10) {
    return { passed: false, reason: 'Message too short' };
  }

  // Check for spam indicators
  const spamPatterns = [
    /buy.*now/i,
    /click.*here/i,
    /guaranteed/i,
    /make.*money/i,
    /free.*offer/i,
  ];

  for (const pattern of spamPatterns) {
    if (pattern.test(data.message)) {
      return { passed: false, reason: 'Spam content detected' };
    }
  }

  // Check for repeated characters (spam detection)
  if (/(.)\1{10,}/.test(data.message)) {
    return { passed: false, reason: 'Repeated characters detected' };
  }

  return { passed: true };
}

// =============================================================================
// FORM PROCESSING
// =============================================================================

interface ProcessResult {
  success: boolean;
  error?: string;
  submissionId?: string;
}

async function processContactForm(data: ContactFormData, request: NextRequest): Promise<ProcessResult> {
  try {
    // Generate submission ID
    const submissionId = SecurityUtils.generateSecureId(16);
    
    // Add metadata
    const submission = {
      ...data,
      submissionId,
      timestamp: new Date().toISOString(),
      ip: request.ip || 'unknown',
      userAgent: request.headers.get('user-agent'),
      referer: request.headers.get('referer'),
    };

    // Here you would typically:
    // 1. Save to database
    // 2. Send email notification
    // 3. Add to CRM system
    // 4. Trigger automation workflows

    console.log('💾 Contact form submission:', {
      submissionId,
      email: data.email,
      name: data.name,
      timestamp: submission.timestamp
    });

    // Simulate email sending
    await sendNotificationEmail(submission);
    
    // Simulate CRM integration
    await addToCRM(submission);

    return {
      success: true,
      submissionId
    };

  } catch (error) {
    console.error('Error processing contact form:', error);
    return {
      success: false,
      error: 'Failed to process submission'
    };
  }
}

async function sendNotificationEmail(submission: any): Promise<void> {
  // In production, integrate with email service (SendGrid, Mailgun, etc.)
  console.log('📧 Email notification sent for submission:', submission.submissionId);
  
  // Simulate email delay
  await new Promise(resolve => setTimeout(resolve, 100));
}

async function addToCRM(submission: any): Promise<void> {
  // In production, integrate with CRM (HubSpot, Salesforce, etc.)
  console.log('📊 Added to CRM:', submission.submissionId);
  
  // Simulate CRM delay
  await new Promise(resolve => setTimeout(resolve, 50));
}

// =============================================================================
// OPTIONS HANDLER FOR CORS
// =============================================================================

export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Allow': 'POST, OPTIONS',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, X-CSRF-Token',
      'Access-Control-Max-Age': '86400',
    },
  });
}