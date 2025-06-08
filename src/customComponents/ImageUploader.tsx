import { useRef } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface ImageUploadProps {
  value: string;
  onChange: (value: string) => void;
}

export default function ImageUpload({ value, onChange }: ImageUploadProps) {
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    const file = files[0];
    const reader = new FileReader();
    reader.onload = (ev) => {
      const result = ev.target?.result;
      if (typeof result === "string") {
        onChange(result); // base64 string
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-2">
      <Input
        type="file"
        accept="image/*"
        ref={fileRef}
        onChange={handleFile}
      />
      {value && (
        <img
          src={value}
          alt="Preview"
          className="max-h-40 rounded border"
        />
      )}
      <Button
        type="button"
        variant="secondary"
        onClick={() => {
          if (fileRef.current) {
            fileRef.current.value = "";
          }
          onChange("");
        }}
        disabled={!value}
      >
        Remove
      </Button>
    </div>
  );
}
