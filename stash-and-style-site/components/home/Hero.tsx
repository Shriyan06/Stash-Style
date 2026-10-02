import { slides } from "@/content/home";
import { brandImage } from "@/lib/brand";
import { HeroSlideshow } from "./HeroSlideshow";

export function Hero() {
  return <HeroSlideshow slides={slides} images={slides.map((s) => brandImage(s.image))} />;
}
