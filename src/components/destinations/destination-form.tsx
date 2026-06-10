"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface Props {
  action: (formData: FormData) => Promise<void>;
  defaultValues?: {
    nameZh?: string;
    nameEn?: string;
    province?: string;
    description?: string;
    country?: string;
    latitude?: number;
    longitude?: number;
  };
  submitLabel?: string;
}

export function DestinationForm({
  action,
  defaultValues,
  submitLabel = "保存",
}: Props) {
  return (
    <form action={action} className="space-y-6 max-w-2xl">
      <div>
        <Label htmlFor="nameZh">中文名称 *</Label>
        <Input
          id="nameZh"
          name="nameZh"
          defaultValue={defaultValues?.nameZh}
          placeholder="例如：三亚"
          required
          className="mt-1"
        />
      </div>

      <div>
        <Label htmlFor="nameEn">英文名称</Label>
        <Input
          id="nameEn"
          name="nameEn"
          defaultValue={defaultValues?.nameEn}
          placeholder="例如：Sanya"
          className="mt-1"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="province">省份</Label>
          <Input
            id="province"
            name="province"
            defaultValue={defaultValues?.province}
            placeholder="例如：海南省"
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor="country">国家</Label>
          <Input
            id="country"
            name="country"
            defaultValue={defaultValues?.country || "中国"}
            className="mt-1"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="description">描述</Label>
        <Textarea
          id="description"
          name="description"
          defaultValue={defaultValues?.description || ""}
          placeholder="介绍这个目的地的特色..."
          rows={4}
          className="mt-1"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="latitude">纬度</Label>
          <Input
            id="latitude"
            name="latitude"
            type="number"
            step="any"
            defaultValue={defaultValues?.latitude?.toString()}
            placeholder="例如：18.2528"
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor="longitude">经度</Label>
          <Input
            id="longitude"
            name="longitude"
            type="number"
            step="any"
            defaultValue={defaultValues?.longitude?.toString()}
            placeholder="例如：109.5120"
            className="mt-1"
          />
        </div>
      </div>

      <Button type="submit">{submitLabel}</Button>
    </form>
  );
}
