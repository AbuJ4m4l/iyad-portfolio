"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { DollarSign, Mail, Clock } from "lucide-react";
import { BlurFade } from "@/components/magicui/blur-fade";
import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function RequestPricingPage() {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    projectType: "",
    message: "",
  });
  const [dialog, setDialog] = useState({ open: false, title: "", message: "" });

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
          title: "Success",
          message: "Your message has been received.",
        });
        setForm({
          firstName: "",
          lastName: "",
          email: "",
          projectType: "",
          message: "",
        });
      } else {
        setDialog({ open: true, title: "Error", message: data.error });
      }
    } catch (err) {
      setDialog({
        open: true,
        title: "Error",
        message: "Something went wrong. Please try again.",
      });
    }
  };

  return (
    <main className="w-full min-h-screen">
      {/* title section */}
      <section
        className="relative flex items-center justify-center text-center px-4 lg:px-[180px] py-20 lg:py-32"
        style={{
          backgroundImage: "url('/Frame 1037.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black to-transparent"></div>
        <div className="relative z-10 max-w-4xl">
          <BlurFade>
            <h1 className="text-3xl md:text-6xl font-bold mb-6 leading-tight">
              Request <span className="text-yellow-500">Pricing</span>
            </h1>
          </BlurFade>
          <BlurFade>
            <h3 className="opacity-80 mt-6 text-lg md:text-xl max-w-2xl mx-auto text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-300">
              Ready to bring your project to life? Fill out the form below and
              get a personalized pricing quote.
            </h3>
          </BlurFade>
        </div>
      </section>

      {/* form */}
      <BlurFade>
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* info section */}
            <div className="p-6">
              <h2 className="text-2xl font-semibold text-white mb-4">
                Why Request a Quote?
              </h2>
              <p className="text-zinc-400 mb-8 max-w-md leading-relaxed">
                Every project is unique, and so is its pricing...
              </p>
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-yellow-500/20 rounded-lg">
                    <Mail className="text-yellow-400" />
                  </div>
                  <div>
                    <p className="text-white font-medium">Email</p>
                    <p className="text-zinc-400">pricing@motioneditor.com</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-yellow-500/20 rounded-lg">
                    <DollarSign className="text-yellow-400" />
                  </div>
                  <div>
                    <p className="text-white font-medium">Custom Pricing</p>
                    <p className="text-zinc-400">Tailored for your project</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-yellow-500/20 rounded-lg">
                    <Clock className="text-yellow-400" />
                  </div>
                  <div>
                    <p className="text-white font-medium">Response Time</p>
                    <p className="text-zinc-400">Usually within 24 hours</p>
                  </div>
                </div>
              </div>
            </div>

            {/* form card */}
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
                  placeholder="Project Type (e.g. Motion Graphics...)"
                  className="bg-zinc-900 border-zinc-700 text-white"
                />
                <Textarea
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  placeholder="Describe your project..."
                  className="bg-zinc-900 border-zinc-700 text-white"
                />
                <Button
                  onClick={handleSubmit}
                  className="w-full bg-gradient-to-r from-yellow-400 to-yellow-500 text-black font-semibold hover:opacity-90"
                >
                  Request Quote
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </BlurFade>

      {/* dialog */}
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
