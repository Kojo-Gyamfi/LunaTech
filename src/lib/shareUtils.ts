import { Product } from "@/types";
import { toast } from "sonner";

export interface ShareOptions {
  title?: string;
  text?: string;
  url?: string;
}

export const generateShareText = (product: Product): string => {
  return `Check out this amazing ${product.category}: ${product.name} - $${product.price}! 🛍️`;
};

export const generateShareUrl = (
  platform: "twitter" | "facebook" | "whatsapp" | "instagram",
  product: Product,
): string => {
  const baseUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/products/${product.id}`
      : "";
  const shareText = generateShareText(product);
  const encodedText = encodeURIComponent(shareText);
  const encodedUrl = encodeURIComponent(baseUrl);

  switch (platform) {
    case "twitter":
      return `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedText}`;

    case "facebook":
      return `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}&quote=${encodedText}`;

    case "whatsapp":
      return `https://wa.me/?text=${encodedText}%20${encodedUrl}`;

    case "instagram":
      return `https://www.instagram.com/`;

    default:
      return "";
  }
};

export const copyToClipboard = async (text: string): Promise<boolean> => {
  try {
    if (
      navigator.clipboard &&
      typeof navigator.clipboard.writeText === "function"
    ) {
      await navigator.clipboard.writeText(text);
      return true;
    } else {
      const textArea = document.createElement("textarea");
      textArea.value = text;
      textArea.style.position = "fixed";
      textArea.style.left = "-999999px";
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      const success = document.execCommand("copy");
      document.body.removeChild(textArea);
      return success;
    }
  } catch (error) {
    console.error("Failed to copy to clipboard:", error);
    return false;
  }
};

export const shareProduct = async (
  platform: "twitter" | "facebook" | "whatsapp" | "instagram",
  product: Product,
): Promise<void> => {
  const shareText = generateShareText(product);
  const baseUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/products/${product.id}`
      : "";

  if (platform === "instagram") {
    const instagramText = `Check this out: ${shareText}\n\n${baseUrl}`;
    const success = await copyToClipboard(instagramText);
    if (success) {
      toast.success("Copied to clipboard! Paste on Instagram.");
    } else {
      toast.error("Failed to copy to clipboard");
    }
    return;
  }

  const shareUrl = generateShareUrl(platform, product);

  if (navigator.share && platform !== "twitter" && platform !== "facebook") {
    try {
      await navigator.share({
        title: product.name,
        text: shareText,
        url: baseUrl,
      });
      toast.success(`Shared on ${platform}!`);
    } catch (error) {
      if ((error as Error).name === "AbortError") {
        return;
      }
      window.open(shareUrl, "_blank", "width=600,height=400");
      toast.success(`Shared on ${platform}!`);
    }
  } else {
    window.open(shareUrl, "_blank", "width=600,height=400");
    toast.success(`Shared on ${platform}!`);
  }
};
