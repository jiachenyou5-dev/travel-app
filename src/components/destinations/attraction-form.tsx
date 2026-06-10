"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface AttractionFormProps {
  action: (formData: FormData) => void;
  defaultValues?: {
    nameZh?: string;
    nameEn?: string;
    description?: string;
    address?: string;
    ticketPrice?: number;
    openingHours?: string;
    website?: string;
    phone?: string;
    latitude?: number;
    longitude?: number;
  };
  submitLabel?: string;
}

export function AttractionForm({
  action,
  defaultValues,
  submitLabel = "保存",
}: AttractionFormProps) {
  return (
    <form action={action} className="space-y-6 max-w-2xl">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="nameZh">中文名称 *</Label>
          <Input
            id="nameZh"
            name="nameZh"
            required
            defaultValue={defaultValues?.nameZh}
          />
        </div>
        <div>
          <Label htmlFor="nameEn">英文名称</Label>
          <Input
            id="nameEn"
            name="nameEn"
            defaultValue={defaultValues?.nameEn}
          />
        </div>
      </div>

      <div>
        <Label htmlFor="description">描述</Label>
        <Textarea
          id="description"
          name="description"
          rows={4}
          defaultValue={defaultValues?.description}
        />
      </div>

      <div>
        <Label htmlFor="address">地址</Label>
        <Input
          id="address"
          name="address"
          defaultValue={defaultValues?.address}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="ticketPrice">票价（元）</Label>
          <Input
            id="ticketPrice"
            name="ticketPrice"
            type="number"
            step="0.01"
            min="0"
            defaultValue={defaultValues?.ticketPrice}
          />
        </div>
        <div>
          <Label htmlFor="openingHours">营业时间</Label>
          <Input
            id="openingHours"
            name="openingHours"
            placeholder="例如：08:00-17:30"
            defaultValue={defaultValues?.openingHours}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="phone">电话</Label>
          <Input
            id="phone"
            name="phone"
            defaultValue={defaultValues?.phone}
          />
        </div>
        <div>
          <Label htmlFor="website">网址</Label>
          <Input
            id="website"
            name="website"
            defaultValue={defaultValues?.website}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="latitude">纬度</Label>
          <Input
            id="latitude"
            name="latitude"
            type="number"
            step="any"
            defaultValue={defaultValues?.latitude}
          />
        </div>
        <div>
          <Label htmlFor="longitude">经度</Label>
          <Input
            id="longitude"
            name="longitude"
            type="number"
            step="any"
            defaultValue={defaultValues?.longitude}
          />
        </div>
      </div>

      <div className="flex gap-4">
        <Button type="submit">{submitLabel}</Button>
        <Button
          type="button"
          variant="outline"
          render={<a href="/admin/attractions">取消</a>}
        />
      </div>
    </form>
  );
}
