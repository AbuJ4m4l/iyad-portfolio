"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Send,
  Save,
  Clock,
  Paperclip,
  ImageIcon,
  Smile,
  Bold,
  Italic,
  Link,
} from "lucide-react";

const emailTemplates = [
  {
    id: "1",
    name: "Initial Project Inquiry Response",
    subject: "Thank you for your interest - Let's discuss your project",
    category: "inquiry",
    content: `Hi {name},

Thank you for reaching out about your video project. I'm excited to learn more about your vision and how I can help bring it to life.

Based on your initial message, I'd love to schedule a brief call to discuss:
• Your specific requirements and timeline
• Creative vision and style preferences
• Budget considerations
• Next steps in the process

I'm available for a 15-20 minute call this week. Please let me know what works best for your schedule.

Looking forward to collaborating with you!

Best regards,
[Your Name]
Video Production Specialist`,
  },
  {
    id: "2",
    name: "Wedding Package Information",
    subject: "Wedding Videography Packages & Pricing",
    category: "wedding",
    content: `Hi {name},

Congratulations on your upcoming wedding! I'm thrilled you're considering me to capture your special day.

Here are my wedding videography packages:

ESSENTIAL PACKAGE - $2,500
• 6 hours of coverage
• Highlight reel (3-4 minutes)
• Ceremony footage
• Basic color correction

PREMIUM PACKAGE - $4,000
• 8 hours of coverage
• Cinematic highlight reel (5-6 minutes)
• Full ceremony & reception footage
• Professional color grading
• Same-day highlight (1-2 minutes)

LUXURY PACKAGE - $6,500
• 10 hours of coverage
• Multiple camera angles
• Drone footage (weather permitting)
• Full documentary-style film
• Raw footage delivery
• Engagement session included

All packages include online gallery delivery and full usage rights.

I'd love to schedule a call to discuss your vision and answer any questions.

Best wishes,
[Your Name]`,
  },
  {
    id: "3",
    name: "Corporate Project Proposal",
    subject: "Corporate Video Production Proposal",
    category: "corporate",
    content: `Hi {name},

Thank you for considering our video production services for your corporate project.

Based on our discussion, I've prepared a comprehensive proposal that includes:

PROJECT SCOPE:
• Pre-production planning and scripting
• Professional filming with cinema-grade equipment
• Post-production editing and color grading
• Motion graphics and brand integration
• Multiple format delivery (web, social, broadcast)

TIMELINE:
• Pre-production: 1-2 weeks
• Production: 2-3 days
• Post-production: 2-3 weeks
• Revisions: 1 week

INVESTMENT: $8,000 - $12,000
(Final quote based on specific requirements)

This investment includes all production costs, equipment, crew, and post-production work. We guarantee professional results that align with your brand standards.

I'm available to discuss this proposal and answer any questions you might have.

Best regards,
[Your Name]
Creative Director`,
  },
  {
    id: "4",
    name: "Project Completion & Delivery",
    subject: "Your video project is complete!",
    category: "delivery",
    content: `Hi {name},

Great news! Your video project is complete and ready for delivery.

PROJECT DELIVERABLES:
• Final edited video (4K and 1080p versions)
• Social media optimized versions
• Raw footage (as requested)
• Project files for future edits

DELIVERY METHOD:
I've uploaded all files to a secure online gallery where you can:
• Preview all deliverables
• Download high-quality files
• Share with your team
• Request minor revisions (if needed)

Gallery Link: [Secure Link]
Access Code: [Code]

The gallery will remain active for 30 days. Please download all files within this timeframe.

It's been a pleasure working with you on this project. I hope the final result exceeds your expectations!

If you need any future video work or have colleagues who might benefit from our services, I'd be happy to help.

Best regards,
[Your Name]`,
  },
  {
    id: "5",
    name: "Follow-up After Quote",
    subject: "Following up on your video project quote",
    category: "follow-up",
    content: `Hi {name},

I hope this message finds you well. I wanted to follow up on the video project quote I sent last week.

I understand that choosing the right videographer is an important decision, and I'm here to answer any questions you might have about:
• The proposed timeline and deliverables
• Our creative approach
• Pricing and payment options
• Previous work examples
• References from similar projects

If you'd like to discuss the project further or need any adjustments to the proposal, I'm happy to schedule a quick call at your convenience.

I'm genuinely excited about the possibility of working together and bringing your vision to life.

Looking forward to hearing from you!

Best regards,
[Your Name]`,
  },
];

export function EmailComposer() {
  const [to, setTo] = useState("");
  const [cc, setCc] = useState("");
  const [bcc, setBcc] = useState("");
  const [subject, setSubject] = useState("");
  const [content, setContent] = useState("");
  const [priority, setPriority] = useState("normal");
  const [selectedTemplate, setSelectedTemplate] = useState("");
  const [showCcBcc, setShowCcBcc] = useState(false);
  const [scheduledSend, setScheduledSend] = useState(false);
  const [scheduleDate, setScheduleDate] = useState("");
  const [scheduleTime, setScheduleTime] = useState("");

  const handleTemplateSelect = (templateId) => {
    const template = emailTemplates.find((t) => t.id === templateId);
    if (template) {
      setSubject(template.subject);
      setContent(template.content);
      setSelectedTemplate(templateId);
    }
  };

  const handleSend = () => {
    console.log("Sending email:", { to, cc, bcc, subject, content, priority });
    // Reset form
    setTo("");
    setCc("");
    setBcc("");
    setSubject("");
    setContent("");
    setPriority("normal");
    setSelectedTemplate("");
    setScheduledSend(false);
    setScheduleDate("");
    setScheduleTime("");
  };

  const handleSaveDraft = () => {
    console.log("Saving draft:", { to, subject, content });
  };

  return (
    <div className="space-y-6">
      {/* Email Templates */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Email Templates</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {emailTemplates.map((template) => (
              <Button
                key={template.id}
                variant={
                  selectedTemplate === template.id ? "default" : "outline"
                }
                className="h-auto p-4 text-left justify-start"
                onClick={() => handleTemplateSelect(template.id)}
              >
                <div className="w-full">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-sm">{template.name}</span>
                    <Badge variant="secondary" className="text-xs">
                      {template.category}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground line-clamp-2">
                    {template.subject}
                  </p>
                </div>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Email Composer */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Send className="h-5 w-5" />
            Compose Email
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Recipients */}
          <div className="space-y-3">
            <div className="space-y-2">
              <Label htmlFor="to">To</Label>
              <div className="flex gap-2">
                <Input
                  id="to"
                  value={to}
                  onChange={(e) => setTo(e.target.value)}
                  placeholder="recipient@example.com"
                  className="flex-1"
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowCcBcc(!showCcBcc)}
                  className="whitespace-nowrap"
                >
                  Cc/Bcc
                </Button>
              </div>
            </div>

            {showCcBcc && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="cc">Cc</Label>
                  <Input
                    id="cc"
                    value={cc}
                    onChange={(e) => setCc(e.target.value)}
                    placeholder="cc@example.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bcc">Bcc</Label>
                  <Input
                    id="bcc"
                    value={bcc}
                    onChange={(e) => setBcc(e.target.value)}
                    placeholder="bcc@example.com"
                  />
                </div>
              </>
            )}
          </div>

          {/* Subject and Priority */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-3 space-y-2">
              <Label htmlFor="subject">Subject</Label>
              <Input
                id="subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Email subject..."
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="priority">Priority</Label>
              <Select value={priority} onValueChange={setPriority}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="normal">Normal</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Formatting Toolbar */}
          <div className="flex items-center gap-2 p-2 border rounded-md bg-accent/20">
            <Button variant="ghost" size="sm">
              <Bold className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm">
              <Italic className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm">
              <Link className="h-4 w-4" />
            </Button>
            <Separator orientation="vertical" className="h-6" />
            <Button variant="ghost" size="sm">
              <Paperclip className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm">
              <ImageIcon className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm">
              <Smile className="h-4 w-4" />
            </Button>
          </div>

          {/* Email Content */}
          <div className="space-y-2">
            <Label htmlFor="content">Message</Label>
            <Textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Type your message here..."
              rows={12}
              className="resize-none"
            />
          </div>

          {/* Schedule Send */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="schedule"
                checked={scheduledSend}
                onChange={(e) => setScheduledSend(e.target.checked)}
                className="rounded"
              />
              <Label htmlFor="schedule" className="text-sm">
                Schedule send
              </Label>
            </div>
            {scheduledSend && (
              <div className="flex gap-2">
                <Input
                  type="date"
                  value={scheduleDate}
                  onChange={(e) => setScheduleDate(e.target.value)}
                  className="w-auto"
                />
                <Input
                  type="time"
                  value={scheduleTime}
                  onChange={(e) => setScheduleTime(e.target.value)}
                  className="w-auto"
                />
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between pt-4">
            <div className="flex items-center gap-2">
              <Button
                onClick={handleSend}
                disabled={!to || !subject || !content}
              >
                <Send className="h-4 w-4 mr-2" />
                {scheduledSend ? "Schedule Send" : "Send Email"}
              </Button>
              <Button variant="outline" onClick={handleSaveDraft}>
                <Save className="h-4 w-4 mr-2" />
                Save Draft
              </Button>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" />
              Auto-saved 2 minutes ago
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
