import { BlurFade } from "@/components/magicui/blur-fade";

export default function SectionTitle({ title, subtitle }) {
  return (
    <BlurFade>
      <div className="text-center mb-12">
        <h2 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 to-yellow-300">
          {title}
        </h2>
        {subtitle && (
          <p className="text-zinc-400 mt-3 max-w-2xl mx-auto">{subtitle}</p>
        )}
        <div className="w-16 h-[2px] bg-yellow-500 mx-auto mt-4 rounded-full" />
      </div>
    </BlurFade>
  );
}
