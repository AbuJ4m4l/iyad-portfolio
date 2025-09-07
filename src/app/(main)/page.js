"use client";
import { Highlighter } from "@/components/magicui/highlighter";
import { RainbowButton } from "@/components/magicui/rainbow-button";
import { WordRotate } from "@/components/magicui/word-rotate";
import Image from "next/image";
import Link from "next/link";
import { Particles } from "@/components/magicui/particles";
import { BlurFade } from "@/components/magicui/blur-fade";
import HeroVideoDialog from "@/components/magicui/hero-video-dialog";
import { MagicCard } from "@/components/magicui/magic-card";
import { motion } from "framer-motion";
import { Image as HeroImage } from "@heroui/react";
import { AuroraText } from "@/components/magicui/aurora-text";

import {
  Scissors,
  Wand2,
  MapPin,
  CheckCircle2,
  Film,
  Headphones,
  Sparkles,
  Youtube,
  Languages,
  Mail,
  Phone,
  Clock,
} from "lucide-react";
import { ShimmerButton } from "@/components/magicui/shimmer-button";

import { Marquee } from "@/components/magicui/marquee";
import { Bebas_Neue } from "next/font/google";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { InteractiveHoverButton } from "@/components/magicui/interactive-hover-button";

import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import SectionTitle from "@/components/sectionTitle";
import { useEffect } from "react";

const bebas_Neue = Bebas_Neue({
  variable: "--font-bebas-neue",
  subsets: ["latin"],
  weight: ["400"],
});

export default function Home() {
  useEffect(() => {
    fetch("http://localhost:5000/api/visitors", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userAgent: navigator.userAgent,
      }),
    })
      .then((response) => response.json())
      .then((data) => console.log("Visitor recorded:", data))
      .catch((error) => console.error("Error:", error));
  }, []);
  const cardBase =
    "relative rounded-2xl p-5 md:p-6 backdrop-blur-sm border border-white/10 text-white";

  return (
    <div className="min-h-screen select-none !bg-[#050505] flex flex-col items-center justify-center text-white space-y-16">
      <div>
        {/* {main hero} */}
        <section
          className="relative flex items-center justify-center text-center px-4 lg:px-[180px] py-20 lg:py-32"
          style={{
            backgroundImage: "url('/hero-background.png')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="absolute inset-0 bg-black/20"></div>

          <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black to-transparent"></div>

          <div className="relative z-10 max-w-4xl">
            <BlurFade>
              <h1 className="text-3xl md:text-6xl font-bold mb-6 leading-tight">
                <span className="text-yellow-500">Empowering</span> Your{" "}
                <span className="text-yellow-500">Imagination</span>{" "}
                <Highlighter
                  action="underline"
                  color="yellow"
                  className="inline-flex"
                >
                  <WordRotate
                    duration={2000}
                    className="font-bold text-white ml-2"
                    words={[
                      "through Video.",
                      "through Motion.",
                      "through Image.",
                    ]}
                  />
                </Highlighter>
              </h1>
            </BlurFade>

            <BlurFade>
              <h3 className="opacity-80 mt-6 text-lg md:text-xl max-w-2xl mx-auto text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-300">
                I’m Iyad, a Motion Graphics Designer, Thumbnail Creator, and
                Video Editor. I bring modern and creative edits tailored exactly
                to what you need.
              </h3>
            </BlurFade>

            {/* الأزرار */}
            <div className="flex gap-4 mt-8 justify-center">
              <BlurFade>
                <Link href="/services">
                  <InteractiveHoverButton className="!text-white font-bold">
                    My services
                  </InteractiveHoverButton>
                </Link>
              </BlurFade>
              <BlurFade>
                <Link href="/contact-us">
                  <InteractiveHoverButton variant="outline">
                    Contact Me
                  </InteractiveHoverButton>
                </Link>
              </BlurFade>
            </div>
          </div>
        </section>

        <div className="p-8">
          <section className="mt-20 px-4">
            {/* العنوان */}
            <SectionTitle
              title="About Me"
              subtitle="Get to know me better and my journey."
            />

            {/* المحتوى */}
            <BlurFade>
              <div className="-mt-20 py-10 md:py-14">
                <div className="mx-auto max-w-6xl px-4 md:px-6">
                  <div className="w-full h-full rounded-xl md:p-6 p-4 flex flex-col lg:flex-row gap-10 lg:gap-16 items-center lg:items-start">
                    {/* الصورة */}
                    <Avatar className="w-[220px] h-[220px] md:w-[280px] md:h-[280px] lg:w-[320px] lg:h-[320px] flex-shrink-0">
                      <AvatarImage src="/me-2x.png" />
                      <AvatarFallback>IA</AvatarFallback>
                    </Avatar>

                    {/* النص */}
                    <div className="flex-1 flex justify-center lg:justify-start">
                      <p className="text-base md:text-lg font-medium text-white/70 opacity-80 leading-relaxed max-w-2xl text-center lg:text-left">
                        My name is Iyad, a passionate{" "}
                        <strong className="font-bold text-yellow-500">
                          Motion Graphics Designer
                        </strong>
                        ,{" "}
                        <strong className="font-bold text-yellow-500">
                          Thumbnail Artist
                        </strong>
                        , and{" "}
                        <strong className="font-bold text-yellow-500">
                          Video Editor
                        </strong>
                        .
                        <br className="hidden md:block" />
                        I specialize in creating unique, modern, and
                        eye-catching visuals that elevate your content.
                        <br className="hidden md:block" />
                        Whether it’s motion graphics, engaging thumbnails, or
                        professional video editing, I make sure every detail is
                        polished to match your vision.
                        <br className="hidden md:block" />
                        My goal is to bring creativity and precision together,
                        delivering results that stand out and connect with your
                        audience.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </BlurFade>
          </section>

          {/* {my skills} */}
          <section>
            <div className="flex flex-col px-4">
              <SectionTitle
                title="My Skills"
                subtitle="Technologies and tools I work with."
              />

              <div className="-mt-20 py-10 md:py-14">
                <div className="mx-auto max-w-6xl px-4 md:px-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {/* Tech / Tools */}
                    <MagicCard
                      className={`${cardBase} col-span-1 md:col-span-2 !bg-[#0f0f0f]`}
                    >
                      <div className="flex items-center gap-3 mb-4">
                        <Scissors className="h-5 w-5" />
                        <span className="text-sm uppercase tracking-wide text-white/70">
                          Tools I Use
                        </span>
                      </div>
                      <div className="relative flex w-full flex-col items-center justify-center overflow-hidden ">
                        <Marquee className="[--duration:20s]">
                          <Image
                            src="/logos/Adobe-After-Effects-Logo-84.png"
                            width={100}
                            height={100}
                            alt="after effects"
                            loading="lazy"
                          />
                          <Image
                            src="/logos/Premiere-Pro-logo-Adobe-symbol-professional-video-editing-transparent-png-image.png"
                            width={100}
                            height={100}
                            alt="premiere pro"
                            loading="lazy"
                          />
                          <Image
                            src="/logos/Photoshop-logo-Adobe-symbol-digital-creativity-transparent-png-image.png"
                            width={100}
                            height={100}
                            alt="photoshop"
                            loading="lazy"
                          />
                          <Image
                            src="/logos/Adobe_Audition_CC_icon_(2020).svg.png"
                            width={100}
                            height={100}
                            className="w-18 h-18 mt-4"
                            alt="audition"
                            loading="lazy"
                          />

                          <Image
                            src="/logos/Figma-logo-design-tool-prototyping-transparent-PNG-image.png"
                            width={80}
                            height={80}
                            alt="figma"
                            loading="lazy"
                          />
                        </Marquee>
                        <Marquee reverse className="[--duration:20s]">
                          <Image
                            src="/logos/Adobe-After-Effects-Logo-84.png"
                            width={100}
                            height={100}
                            alt="after effects"
                            loading="lazy"
                          />
                          <Image
                            src="/logos/Premiere-Pro-logo-Adobe-symbol-professional-video-editing-transparent-png-image.png"
                            width={100}
                            height={100}
                            alt="premiere pro"
                            loading="lazy"
                          />
                          <Image
                            src="/logos/Photoshop-logo-Adobe-symbol-digital-creativity-transparent-png-image.png"
                            width={100}
                            height={100}
                            alt="photoshop"
                            loading="lazy"
                          />
                          <Image
                            src="/logos/Adobe_Audition_CC_icon_(2020).svg.png"
                            width={100}
                            height={100}
                            className="w-18 h-18 mt-4"
                            alt="audition"
                            loading="lazy"
                          />

                          <Image
                            src="/logos/Figma-logo-design-tool-prototyping-transparent-PNG-image.png"
                            width={80}
                            height={80}
                            alt="figma"
                            loading="lazy"
                          />
                        </Marquee>
                        <div className="pointer-events-none absolute inset-y-0 left-0 w-1/4 bg-gradient-to-r from-background"></div>
                        <div className="pointer-events-none absolute inset-y-0 right-0 w-1/4 bg-gradient-to-l from-background"></div>
                      </div>
                      <p className="mt-4 text-sm text-white/60 text-center">
                        Core toolkit for motion graphics, editing and audio.
                      </p>
                    </MagicCard>

                    {/* Typing / Speed */}
                    <MagicCard className={`${cardBase}`}>
                      <div className="flex items-center gap-3 mb-3">
                        <Clock className="h-5 w-5" />
                        <span className="text-sm uppercase tracking-wide text-white/70">
                          Delivering time
                        </span>
                      </div>
                      <div className="text-5xl font-bold leading-none">
                        2h–3d
                      </div>
                      <p className="mt-3 text-sm text-white/60">
                        Depends on scope (shorts/highlights → long-form videos &
                        motion), <b>Usually 1 day.</b>
                      </p>
                    </MagicCard>

                    {/* Location */}
                    <MagicCard className={`${cardBase}`}>
                      <div className="flex items-center gap-3 mb-3">
                        <MapPin className="h-5 w-5" />
                        <span className="text-sm uppercase tracking-wide text-white/70">
                          Location
                        </span>
                      </div>
                      <div className="text-3xl font-semibold">Turkey</div>
                      <p className="mt-2 text-sm text-white/60">
                        Available for remote work & collaborations.
                      </p>
                    </MagicCard>

                    {/* Projects / Stats */}
                    <MagicCard className={`${cardBase}`}>
                      <div className="flex items-center gap-3 mb-3">
                        <CheckCircle2 className="h-5 w-5" />
                        <span className="text-sm uppercase tracking-wide text-white/70">
                          Projects
                        </span>
                      </div>
                      <div className="text-5xl font-bold leading-none">
                        100+
                      </div>
                      <p className="mt-3 text-sm text-white/60">
                        Delivered for YouTube & clients.
                      </p>
                    </MagicCard>
                    <MagicCard className={`${cardBase}`}>
                      <div className="flex items-center gap-3 mb-3">
                        <Languages className="size-5" />
                        <span className="text-sm uppercase tracking-wide text-white/70">
                          Languages
                        </span>
                      </div>
                      <div className="text-5xl font-bold leading-none">
                        3+ Langs
                      </div>
                      <p className="mt-3 text-sm text-white/60">
                        I can talk and edit (Arabic, English, Turkish) videos.
                      </p>
                    </MagicCard>
                  </div>
                </div>
              </div>
            </div>
          </section>
          {/* {my works} */}
          <section>
            <div className="mt-10 flex flex-col px-4">
              <BlurFade>
                <SectionTitle
                  title="My Works"
                  subtitle="A collection of my favorite projects."
                />
              </BlurFade>
            </div>
            <BlurFade>
              <div className="-mt-20 py-10 md:py-14">
                <div className="mx-4 md:mx-10  px-4 md:px-6">
                  <div className="bg-[#0f0f0f] w-full h-full rounded-xl md:p-6 p-4 space-y-6">
                    <BlurFade>
                      <div>
                        <h1 className="text-4xl md:text-5xl font-bold text-center">
                          Motion Graphics
                        </h1>
                        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 p-4 md:p-6 h-[450px] overflow-y-auto">
                          <HeroVideoDialog
                            className="block size-auto"
                            animationStyle="from-center"
                            videoSrc="/videos/1.mp4"
                            thumbnailSrc="/thumbnails/hero-light.png"
                            thumbnailAlt="Hero Video"
                          />
                          <HeroVideoDialog
                            className="block size-auto"
                            animationStyle="from-center"
                            videoSrc="/videos/1.mp4"
                            thumbnailSrc="/thumbnails/hero-light.png"
                            thumbnailAlt="Hero Video"
                          />
                          <HeroVideoDialog
                            className="block size-auto"
                            animationStyle="from-center"
                            videoSrc="/videos/1.mp4"
                            thumbnailSrc="/thumbnails/hero-light.png"
                            thumbnailAlt="Hero Video"
                          />
                        </div>
                      </div>
                    </BlurFade>
                    <BlurFade>
                      <div>
                        <h1 className="text-4xl md:text-5xl font-bold text-center">
                          Video Editing
                        </h1>
                        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 p-4 md:p-6 h-[450px] overflow-y-auto">
                          <HeroVideoDialog
                            className="block size-auto"
                            animationStyle="from-center"
                            videoSrc="/videos/1.mp4"
                            thumbnailSrc="/thumbnails/hero-light.png"
                            thumbnailAlt="Hero Video"
                          />
                          <HeroVideoDialog
                            className="block size-auto"
                            animationStyle="from-center"
                            videoSrc="/videos/1.mp4"
                            thumbnailSrc="/thumbnails/hero-light.png"
                            thumbnailAlt="Hero Video"
                          />
                          <HeroVideoDialog
                            className="block size-auto"
                            animationStyle="from-center"
                            videoSrc="/videos/1.mp4"
                            thumbnailSrc="/thumbnails/hero-light.png"
                            thumbnailAlt="Hero Video"
                          />
                        </div>
                      </div>
                    </BlurFade>
                    <BlurFade>
                      <div>
                        <h1 className="text-4xl md:text-5xl font-bold text-center">
                          Thumbnail Designing
                        </h1>
                        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 p-4 md:p-6 h-[450px] overflow-y-auto">
                          <HeroImage
                            isZoomed
                            className="block size-auto opacity-100"
                            src="/thumbnails/hero-light.png"
                            alt="thumbnail"
                          />
                          <HeroImage
                            isZoomed
                            className="block size-auto opacity-100"
                            src="/thumbnails/hero-light.png"
                            alt="thumbnail"
                          />
                          <HeroImage
                            isZoomed
                            className="block size-auto opacity-100"
                            src="/thumbnails/hero-light.png"
                            alt="thumbnail"
                          />
                        </div>
                      </div>
                    </BlurFade>
                  </div>
                  <div className="justify-center flex">
                    <InteractiveHoverButton className={"invert mt-5"}>
                      <Link href="/showcase">Showcase</Link>
                    </InteractiveHoverButton>
                  </div>
                </div>
              </div>
            </BlurFade>
          </section>
          {/* {why me section} */}
          <section>
            <div className="mt-10 flex flex-col px-4">
              <BlurFade>
                <SectionTitle
                  title="Why Me"
                  subtitle="Here’s why you should work with me."
                />
              </BlurFade>
            </div>
            <BlurFade>
              <div className="py-10 md:py-14">
                <div className="mx-4 md:mx-10  px-4 md:px-6">
                  <div className="w-full h-full rounded-xl md:p-6 p-4 space-y-6">
                    <BlurFade>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[
                          {
                            emoji: "⚡",
                            title: "Fast Delivery",
                          },
                          {
                            emoji: "🎨",
                            title: "Creativity",
                          },
                          {
                            emoji: "🚀",
                            title: "Trend edits",
                          },
                          {
                            emoji: "🎬",
                            title: "Experience",
                          },
                          {
                            emoji: "📈",
                            title: "More Engagement",
                          },
                          {
                            emoji: "🌍",
                            title: "Remote Work",
                          },
                        ].map((item, i) => (
                          <MagicCard
                            key={i}
                            className={`${cardBase} bg-gradient-to-br from-zinc-800 to-zinc-900 hover:scale-105 transition-transform`}
                          >
                            <div className="flex flex-col items-center gap-4 p-6">
                              <span className="text-5xl">{item.emoji}</span>
                              <span className="text-lg font-bold uppercase tracking-wide text-white">
                                {item.title}
                              </span>
                            </div>
                          </MagicCard>
                        ))}
                      </div>
                    </BlurFade>
                  </div>
                </div>
              </div>
            </BlurFade>
          </section>
          {/* {contact us} */}
          <section className="w-full py-20">
            <div className="container mx-auto px-6 lg:px-20">
              {/* Title */}
              <div className="text-center mb-16">
                <h2 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 to-yellow-300">
                  Let’s Connect
                </h2>
                <p className="text-zinc-400 mt-3">
                  Ready to bring your vision to life? Let’s discuss your next
                  video project.
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
                    I’m always excited to work on new projects and collaborate
                    with creative minds. Whether you need a quick social media
                    edit or a full cinematic production, let’s discuss how I can
                    help bring your story to life.
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
                        placeholder="First Name"
                        className="bg-zinc-900 border-zinc-700 text-white"
                      />
                      <Input
                        placeholder="Last Name"
                        className="bg-zinc-900 border-zinc-700 text-white"
                      />
                    </div>
                    <Input
                      placeholder="Email"
                      type="email"
                      className="bg-zinc-900 border-zinc-700 text-white"
                    />
                    <Input
                      placeholder="Project Type (e.g. Motion Graphics, Video Editing, Thumbnail...)"
                      className="bg-zinc-900 border-zinc-700 text-white"
                    />
                    <Textarea
                      placeholder="Tell me about your project, timeline, and vision..."
                      className="bg-zinc-900 border-zinc-700 text-white"
                    />
                    <Button className="w-full bg-gradient-to-r from-yellow-600 to-yellow-400 text-white font-semibold hover:opacity-90">
                      Send Message
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
