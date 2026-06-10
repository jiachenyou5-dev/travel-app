"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface RestaurantFormProps {
  action: (formData: FormData) => void;
  defaultValues?: {
    nameZh?: string;
    nameEn?: string;
    description?: string;
    address?: string;
    cuisineType?: string;
    priceRange?: string;
    openingHours?: string;
    website?: string;
    phone?: string;
    latitude?: number;
    longitude?: number;
  };
  submitLabel?: string;
}

export function RestaurantForm({
  action,
  defaultValues,
  submitLabel = "保存",
}: RestaurantFormProps) {
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
          <Label htmlFor="cuisineType">菜系</Label>
          <Input
            id="cuisineType"
            name="cuisineType"
            placeholder="例如：川菜、粤菜、日料"
            defaultValue={defaultValues?.cuisineType}
          />
        </div>
        <div>
          <Label htmlFor="priceRange">价格区间</Label>
          <Input
            id="priceRange"
            name="priceRange"
            placeholder="例如：人均 ¥50-100"
            defaultValue={defaultValues?.priceRange}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="openingHours">营业时间</Label>
          <Input
            id="openingHours"
            name="openingHours"
            placeholder="例如：10:00-22:00"
            defaultValue={defaultValues?.openingHours}
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
          render={<a href="/admin/restaurants">取消</a>}
        />
      </div>
    </form>
  );
}
