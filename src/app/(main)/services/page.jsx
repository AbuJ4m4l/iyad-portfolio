"use client";
import VideoComparison from "@/components/compare";
import { BlurFade } from "@/components/magicui/blur-fade";
import { Highlighter } from "@/components/magicui/highlighter";
import { InteractiveHoverButton } from "@/components/magicui/interactive-hover-button";
import { WordRotate } from "@/components/magicui/word-rotate";
import { Button } from "@/components/ui/button";
import { Image } from "@heroui/react";
import { Link } from "lucide-react";
import React, { useEffect } from "react";

export default function services() {
  useEffect(() => {
    fetch("https://rastan.shop/api/visitors", {
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
  return (
    <div>
      {/* {main hero} */}
      <section
        className="relative flex items-center justify-center text-center px-4 lg:px-[180px] py-20 lg:py-32"
        style={{
          backgroundImage: "url('/Frame 1035.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-black/10"></div>

        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black to-transparent"></div>

        <div className="relative z-10 max-w-4xl">
          <BlurFade>
            <h1 className="text-3xl md:text-6xl font-bold mb-6 leading-tight">
              My <span className="text-yellow-500">Services</span>{" "}
            </h1>
          </BlurFade>

          <BlurFade>
            <h3 className="opacity-80 mt-6 text-lg md:text-xl max-w-2xl mx-auto text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-300">
              Explore my creative services in video editing, motion graphics,
              and thumbnail design—crafted to make your content stand out!
            </h3>
          </BlurFade>
        </div>
      </section>
      <section className="py-20 text-white">
        <div className="max-w-6xl mx-auto px-4 space-y-24">
          <BlurFade>
            <div className="flex flex-col md:flex-row gap-10 items-center">
              {/* Text */}
              <div className="space-y-6 md:w-1/2">
                <h2 className="text-3xl md:text-4xl font-bold">
                  Motion Graphics
                </h2>
                <p className="text-lg text-gray-300">
                  Motion graphics is all about transforming ideas into visually
                  dynamic stories. Through smooth animations, engaging
                  transitions, and creative design elements, motion graphics
                  help brands and creators communicate their message in a way
                  that is both entertaining and memorable. Whether it’s a
                  product showcase, an explainer video, or promotional content,
                  motion graphics bring a layer of professionalism and
                  creativity that static visuals can’t achieve. By combining
                  movement, color, and design, motion graphics instantly grab
                  attention and hold it, making the content much more impactful.
                </p>
              </div>
              {/* Video */}
              <div className="w-full md:w-1/2">
                <video
                  src="/videos/1.mp4"
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="w-full rounded-2xl shadow-lg"
                />
              </div>
            </div>
          </BlurFade>

          <BlurFade>
            <div className="flex flex-col md:flex-row-reverse gap-10 items-center">
              {/* Text */}
              <div className="space-y-6 md:w-1/2">
                <h2 className="text-3xl md:text-4xl font-bold">
                  Video Editing
                </h2>
                <p className="text-lg text-gray-300">
                  Video editing is the process that turns raw footage into a
                  polished final product. It’s not just about cutting and
                  trimming clips; it’s about building a story that keeps the
                  audience engaged from start to finish. Professional editing
                  adds rhythm, flow, and style to any project, whether it’s
                  YouTube videos, commercials, or cinematic content. From
                  adjusting pacing and timing, to enhancing visuals with
                  transitions and overlays, to perfecting the audio for clarity
                  and impact, video editing is what gives content its
                  professional edge. A well-edited video creates emotional
                  connections, makes the message clear, and leaves a lasting
                  impression on viewers.
                </p>
              </div>
              {/* Video */}
              <div className="w-full md:w-1/2">
                <video
                  src="/videos/1.mp4"
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="w-full rounded-2xl shadow-lg"
                />
              </div>
            </div>
          </BlurFade>

          <BlurFade>
            <div className="flex flex-col md:flex-row gap-10 items-center">
              {/* Text */}
              <div className="space-y-6 md:w-1/2">
                <h2 className="text-3xl md:text-4xl font-bold">
                  Thumbnail Designing
                </h2>
                <p className="text-lg text-gray-300">
                  Thumbnails are the first impression of any video, and in
                  today’s fast-paced digital world, first impressions are
                  everything. A high-quality thumbnail design can be the
                  difference between someone clicking your video or scrolling
                  past it. Thumbnails need to be bold, eye-catching, and clear
                  enough to tell a story in just one frame. Good thumbnail
                  design involves understanding color theory, typography,
                  composition, and viewer psychology to create something that
                  stands out. By carefully designing thumbnails that align with
                  the video’s content while sparking curiosity, creators can
                  dramatically increase their click-through rate and overall
                  audience engagement.
                </p>
              </div>
              {/* Video */}
              <div className="w-full md:w-1/2">
                <video
                  src="/videos/1.mp4"
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="w-full rounded-2xl shadow-lg"
                />
              </div>
            </div>
          </BlurFade>
        </div>
      </section>

      <section className="text-white py-20">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 items-center gap-10">
          {/* Text Content */}
          <div className="space-y-6">
            <h2 className="text-4xl font-bold leading-snug">
              Hope You like My <span className="text-yellow-500">Services</span>
            </h2>
            <p className="text-gray-300 text-lg leading-relaxed">
              We welcome your contact and encourage you to connect with us.
              Whether you have inquiries, ideas to share, or potential
              collaborations in mind, we're here and eager to engage. Your
              message is important to us, and we're excited about the
              opportunity to connect and explore the possibilities together.
              Feel free to reach out – we're just a message away!
            </p>
            <div className="flex gap-4 justify-center md:justify-normal">
              <Button className="bg-yellow-500 text-black hover:bg-yellow-600">
                Contact Me
              </Button>{" "}
              <Button className="bg-yellow-500 text-black hover:bg-yellow-600">
                Showcase
              </Button>
            </div>
          </div>

          {/* Image */}
          <div className="flex justify-center md:justify-end">
            <Image
              src="/contact-illustration.png" // put your image inside public/images
              alt="Contact Illustration"
              width={500}
              height={250}
              className="size-full"
            />
          </div>
        </div>
      </section>
    </div>
  );
}
