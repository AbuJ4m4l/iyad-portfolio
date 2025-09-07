"use client";

import { BlurFade } from "@/components/magicui/blur-fade";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Clock, Mail, Phone } from "lucide-react";
import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function ContactMePage() {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    projectType: "",
    message: "",
  });

  const [dialog, setDialog] = useState({
    open: false,
    title: "",
    message: "",
    type: "success", // "success" | "error"
  });

  useEffect(() => {
    fetch("http://rastan.shop/api/visitors", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userAgent: navigator.userAgent }),
    }).catch(() => {});
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      const res = await fetch("http://rastan.shop/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();

      if (data.success) {
        setDialog({
          open: true,
          title: "🎉 Message Sent!",
          message:
            "Thank you! Your message has been received. We'll be in touch soon.",
          type: "success",
        });
        setForm({
          firstName: "",
          lastName: "",
          email: "",
          projectType: "",
          message: "",
        });
      } else {
        setDialog({
          open: true,
          title: "⚠️ Error",
          message: data.error || "Please fill all required fields.",
          type: "error",
        });
      }
    } catch (err) {
      setDialog({
        open: true,
        title: "❌ Oops!",
        message: "Something went wrong. Please try again later.",
        type: "error",
      });
    }
  };

  return (
    <main>
      {/* Hero Section */}
      <section
        className="relative flex items-center justify-center text-center px-4 lg:px-[180px] py-20 lg:py-32"
        style={{
          backgroundImage: "url('/Frame 1038.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black to-transparent"></div>
        <div className="relative z-10 max-w-4xl">
          <BlurFade>
            <h1 className="text-3xl md:text-6xl font-bold mb-6 leading-tight">
              Contact <span className="text-yellow-500">Me</span>
            </h1>
          </BlurFade>
          <BlurFade>
            <h3 className="opacity-80 mt-6 text-lg md:text-xl max-w-2xl mx-auto text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-300">
              Got questions or ideas? Let’s connect and make it happen!
            </h3>
          </BlurFade>
        </div>
      </section>

      {/* Contact Section */}
      <section className="w-full py-20">
        <div className="container mx-auto px-6 lg:px-20">
          {/* Title */}
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 to-yellow-300">
              Let’s Connect
            </h2>
            <p className="text-zinc-400 mt-3">
              Ready to bring your vision to life? Let’s discuss your next video
              project.
            </p>
            <div className="w-16 h-[2px] bg-yellow-500 mx-auto mt-4 rounded-full" />
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Info */}
            <div>
              <h3 className="text-2xl font-semibold text-white mb-4">
                Get In Touch
              </h3>
              <p className="text-zinc-400 mb-8 max-w-md">
                I’m always excited to work on new projects and collaborate with
                creative minds...
              </p>

              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-yellow-900/40 rounded-lg">
                    <Mail className="text-yellow-500" />
                  </div>
                  <div>
                    <p className="text-white font-medium">Email</p>
                    <p className="text-zinc-400">iyad@motioneditor.com</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="p-3 bg-yellow-900/40 rounded-lg">
                    <Phone className="text-yellow-500" />
                  </div>
                  <div>
                    <p className="text-white font-medium">Phone</p>
                    <p className="text-zinc-400">+90 555 123 4567</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="p-3 bg-yellow-900/40 rounded-lg">
                    <Clock className="text-yellow-500" />
                  </div>
                  <div>
                    <p className="text-white font-medium">Response Time</p>
                    <p className="text-zinc-400">Usually within 24 hours</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <Card className="bg-zinc-950/70 border border-zinc-800 shadow-xl">
              <CardContent className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    name="firstName"
                    value={form.firstName}
                    onChange={handleChange}
                    placeholder="First Name"
                    className="bg-zinc-900 border-zinc-700 text-white"
                  />
                  <Input
                    name="lastName"
                    value={form.lastName}
                    onChange={handleChange}
                    placeholder="Last Name"
                    className="bg-zinc-900 border-zinc-700 text-white"
                  />
                </div>
                <Input
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="Email"
                  type="email"
                  className="bg-zinc-900 border-zinc-700 text-white"
                />
                <Input
                  name="projectType"
                  value={form.projectType}
                  onChange={handleChange}
                  placeholder="Project Type (e.g. Motion Graphics, Video Editing...)"
                  className="bg-zinc-900 border-zinc-700 text-white"
                />
                <Textarea
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  placeholder="Tell me about your project, timeline, and vision..."
                  className="bg-zinc-900 border-zinc-700 text-white"
                />
                <Button
                  onClick={handleSubmit}
                  className="w-full bg-gradient-to-r from-yellow-600 to-yellow-400 text-white font-semibold hover:opacity-90"
                >
                  Send Message
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Dialog */}
      <Dialog
        open={dialog.open}
        onOpenChange={() => setDialog({ ...dialog, open: false })}
      >
        <DialogContent
          className={`${
            dialog.type === "success"
              ? "bg-green-600 text-black"
              : "bg-red-600 text-white"
          }`}
        >
          <DialogHeader>
            <DialogTitle>{dialog.title}</DialogTitle>
          </DialogHeader>
          <p>{dialog.message}</p>
        </DialogContent>
      </Dialog>
    </main>
  );
}
