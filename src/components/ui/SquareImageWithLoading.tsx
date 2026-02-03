//@ts-nocheck
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";

export function SquareImageWithLoading({ url }: { url: string }) {
  return (
    <Avatar className="h-full w-full">
      <AvatarImage className="h-full w-full rounded-sm " src={url} alt="@shadcn" />
      <AvatarFallback className="flex h-full w-full items-center justify-center bg-gray-300 rounded-sm animate-pulse">
      </AvatarFallback>
    </Avatar>
  );
}
