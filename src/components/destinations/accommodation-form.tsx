"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface AccommodationFormProps {
  action: (formData: FormData) => void;
  defaultValues?: {
    nameZh?: string;
    nameEn?: string;
    description?: string;
    address?: string;
    accommodationType?: string;
    priceRange?: string;
    starRating?: number;
    amenities?: string;
    phone?: string;
    website?: string;
    latitude?: number;
    longitude?: number;
  };
  submitLabel?: string;
}

export function AccommodationForm({
  action,
  defaultValues,
  submitLabel = "保存",
}: AccommodationFormProps) {
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
          <Label htmlFor="accommodationType">住宿类型</Label>
          <Input
            id="accommodationType"
            name="accommodationType"
            placeholder="例如：酒店、民宿、青旅"
            defaultValue={defaultValues?.accommodationType}
          />
        </div>
        <div>
          <Label htmlFor="priceRange">价格区间</Label>
          <Input
            id="priceRange"
            name="priceRange"
            placeholder="例如：¥200-500/晚"
            defaultValue={defaultValues?.priceRange}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="starRating">星级</Label>
          <Input
            id="starRating"
            name="starRating"
            type="number"
            min="1"
            max="5"
            defaultValue={defaultValues?.starRating}
          />
        </div>
        <div>
          <Label htmlFor="phone">电话</Label>
          <Input
            id="phone"
            name="phone"
            defaultValue={defaultValues?.phone}
          />
        </div>
      </div>

      <div>
        <Label htmlFor="amenities">设施</Label>
        <Input
          id="amenities"
          name="amenities"
          placeholder="例如：WiFi、停车场、游泳池"
          defaultValue={defaultValues?.amenities}
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
          render={<a href="/admin/accommodations">取消</a>}
        />
      </div>
    </form>
  );
}
