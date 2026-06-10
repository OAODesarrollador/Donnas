"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  BadgeDollarSign,
  Building2,
  Check,
  ClipboardList,
  ImageIcon,
  Layers3,
  LogOut,
  Package,
  Percent,
  RefreshCw,
  Save,
  Upload,
} from "lucide-react";
import type {
  AdminBusinessInfo,
  AdminCategory,
  AdminDashboardData,
  AdminOrder,
  AdminProduct,
  AdminPromotion,
} from "@/lib/adminTypes";

type AdminTab = "products" | "categories" | "promotions" | "business" | "orders";
type EditableEntity = AdminProduct | AdminCategory | AdminPromotion | AdminBusinessInfo | AdminOrder;

interface AdminDashboardProps {
  initialData: AdminDashboardData;
}

interface BlobImage {
  url: string;
  pathname: string;
  size: number;
  uploadedAt: string;
}

const tabs: Array<{ id: AdminTab; label: string; icon: React.ReactNode }> = [
  { id: "products", label: "Productos", icon: <Package className="h-4 w-4" /> },
  { id: "categories", label: "Categorías", icon: <Layers3 className="h-4 w-4" /> },
  { id: "promotions", label: "Promos", icon: <Percent className="h-4 w-4" /> },
  { id: "business", label: "Empresa", icon: <Building2 className="h-4 w-4" /> },
  { id: "orders", label: "Pedidos", icon: <ClipboardList className="h-4 w-4" /> },
];

const formatPrice = (value: number) => `$${value.toLocaleString("es-AR")}`;

const getEntityTitle = (item: EditableEntity) => {
  if ("customerName" in item) return item.customerName;
  if ("title" in item) return item.title;
  if ("brandDisplay" in item) return item.brandDisplay;
  return item.name;
};

const getEntitySubtitle = (item: EditableEntity) => {
  if ("price" in item) return formatPrice(item.price);
  if ("status" in item) return item.status;
  if ("phone" in item) return item.phone;
  return item.slug;
};

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ initialData }) => {
  const [activeTab, setActiveTab] = useState<AdminTab>("products");
  const [data, setData] = useState(initialData);
  const [selectedId, setSelectedId] = useState<string>(initialData.products[0]?.id ?? "");
  const [draft, setDraft] = useState<EditableEntity | null>(initialData.products[0] ?? null);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [blobImages, setBlobImages] = useState<BlobImage[]>([]);
  const [isLoadingBlobImages, setIsLoadingBlobImages] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [imageError, setImageError] = useState("");
  const [saveState, setSaveState] = useState<"idle" | "saved" | "error">("idle");

  const stats = useMemo(
    () => [
      { label: "Productos", value: data.products.length },
      { label: "Activos", value: data.products.filter((product) => product.isAvailable).length },
      { label: "Categorías", value: data.categories.length },
      { label: "Pedidos", value: data.orders.length },
    ],
    [data],
  );

  const selectTab = (tab: AdminTab) => {
    setActiveTab(tab);
    setSaveState("idle");

    const firstByTab: Record<AdminTab, EditableEntity | null> = {
      products: data.products[0] ?? null,
      categories: data.categories[0] ?? null,
      promotions: data.promotions[0] ?? null,
      business: data.businessInfo,
      orders: data.orders[0] ?? null,
    };

    const first = firstByTab[tab];
    setSelectedId(first?.id ?? "");
    setDraft(first ? structuredClone(first) : null);
  };

  const loadBlobImages = useCallback(async () => {
    setIsLoadingBlobImages(true);
    setImageError("");

    try {
      const response = await fetch("/api/admin/blob");
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error ?? "No se pudieron cargar las imágenes.");
      }

      const data = (await response.json()) as { images: BlobImage[] };
      setBlobImages(data.images);
    } catch (error) {
      setImageError(error instanceof Error ? error.message : "No se pudieron cargar las imágenes.");
    } finally {
      setIsLoadingBlobImages(false);
    }
  }, []);

  useEffect(() => {
    if (activeTab === "products" && blobImages.length === 0 && !isLoadingBlobImages) {
      const frame = window.requestAnimationFrame(() => {
        void loadBlobImages();
      });

      return () => window.cancelAnimationFrame(frame);
    }

    return undefined;
  }, [activeTab, blobImages.length, isLoadingBlobImages, loadBlobImages]);

  const selectEntity = (entity: EditableEntity) => {
    setSelectedId(entity.id);
    setDraft(structuredClone(entity));
    setSaveState("idle");
  };

  const updateDraft = (field: string, value: string | number | boolean | null) => {
    setDraft((current) => (current ? { ...current, [field]: value } : current));
    setSaveState("idle");
  };

  const saveDraft = async () => {
    if (!draft) return;

    setIsSaving(true);
    setSaveState("idle");

    const entityByTab: Record<AdminTab, "product" | "category" | "promotion" | "business" | "order"> = {
      products: "product",
      categories: "category",
      promotions: "promotion",
      business: "business",
      orders: "order",
    };

    try {
      const response = await fetch("/api/admin", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          entity: entityByTab[activeTab],
          id: draft.id,
          data: draft,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error ?? "No se pudo guardar.");
      }

      setData((current) => {
        if (activeTab === "products") {
          return {
            ...current,
            products: current.products.map((product) =>
              product.id === draft.id ? (draft as AdminProduct) : product,
            ),
          };
        }

        if (activeTab === "categories") {
          return {
            ...current,
            categories: current.categories.map((category) =>
              category.id === draft.id ? (draft as AdminCategory) : category,
            ),
          };
        }

        if (activeTab === "promotions") {
          return {
            ...current,
            promotions: current.promotions.map((promotion) =>
              promotion.id === draft.id ? (draft as AdminPromotion) : promotion,
            ),
          };
        }

        if (activeTab === "business") {
          return {
            ...current,
            businessInfo: draft as AdminBusinessInfo,
          };
        }

        return {
          ...current,
          orders: current.orders.map((order) => (order.id === draft.id ? (draft as AdminOrder) : order)),
        };
      });
      setSaveState("saved");
    } catch (error) {
      console.error(error);
      setSaveState("error");
    } finally {
      setIsSaving(false);
    }
  };

  const logout = async () => {
    setIsLoggingOut(true);
    await fetch("/api/admin/logout", { method: "POST" });
    window.location.href = "/admin/login";
  };

  const uploadProductImage = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";

    if (!file) {
      return;
    }

    setIsUploadingImage(true);
    setImageError("");

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/admin/blob", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error ?? "No se pudo subir la imagen.");
      }

      const data = (await response.json()) as { image: BlobImage };
      setBlobImages((current) => [data.image, ...current]);
      updateDraft("image", data.image.url);
    } catch (error) {
      setImageError(error instanceof Error ? error.message : "No se pudo subir la imagen.");
    } finally {
      setIsUploadingImage(false);
    }
  };

  const renderInput = (
    label: string,
    field: string,
    options?: { multiline?: boolean; type?: "text" | "number"; disabled?: boolean },
  ) => {
    if (!draft) return null;
    const value = (draft as unknown as Record<string, string | number | null>)[field] ?? "";

    return (
      <label className="flex flex-col gap-2">
        <span className="text-xs font-black uppercase tracking-[0.16em] text-brand-cacao/45">{label}</span>
        {options?.multiline ? (
          <textarea
            value={String(value)}
            disabled={options.disabled}
            onChange={(event) => updateDraft(field, event.target.value)}
            className="min-h-28 resize-y rounded-xl border border-brand-cacao/10 bg-white px-4 py-3 text-sm font-semibold text-brand-cacao outline-none transition focus:border-brand-hazelnut disabled:opacity-60"
          />
        ) : (
          <input
            value={String(value)}
            type={options?.type ?? "text"}
            disabled={options?.disabled}
            onChange={(event) =>
              updateDraft(field, options?.type === "number" ? Number(event.target.value) : event.target.value)
            }
            className="rounded-xl border border-brand-cacao/10 bg-white px-4 py-3 text-sm font-semibold text-brand-cacao outline-none transition focus:border-brand-hazelnut disabled:opacity-60"
          />
        )}
      </label>
    );
  };

  const renderProductImagePicker = () => {
    if (!draft || !("image" in draft)) return null;
    const currentImage = String((draft as AdminProduct).image ?? "");
    const currentIsPhoto = currentImage.startsWith("/assets") || currentImage.startsWith("https://") || currentImage.startsWith("http://");

    return (
      <div className="md:col-span-2 rounded-2xl border border-brand-cacao/8 bg-brand-cream/35 p-4">
        <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.16em] text-brand-cacao/45">
              Imagen del producto
            </p>
            <p className="mt-1 text-sm font-semibold text-brand-cacao/60">
              Seleccioná una imagen subida a Vercel Blob o cargá una nueva.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={loadBlobImages}
              disabled={isLoadingBlobImages}
              className="inline-flex items-center gap-2 rounded-xl border border-brand-cacao/10 bg-white px-4 py-2 text-xs font-black uppercase tracking-wide text-brand-cacao transition hover:bg-brand-pink/30 disabled:opacity-60"
            >
              <RefreshCw className={`h-4 w-4 ${isLoadingBlobImages ? "animate-spin" : ""}`} />
              Actualizar
            </button>

            <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-brand-cacao px-4 py-2 text-xs font-black uppercase tracking-wide text-brand-cream transition hover:bg-brand-chocolate">
              <Upload className="h-4 w-4" />
              {isUploadingImage ? "Subiendo" : "Subir"}
              <input
                type="file"
                accept="image/*"
                disabled={isUploadingImage}
                onChange={uploadProductImage}
                className="hidden"
              />
            </label>
          </div>
        </div>

        <div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-[180px_minmax(0,1fr)]">
          <div className="relative flex aspect-[4/3] items-center justify-center overflow-hidden rounded-xl border border-brand-cacao/8 bg-white">
            {currentIsPhoto ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={currentImage} alt="" className="h-full w-full object-cover" />
            ) : (
              <ImageIcon className="h-10 w-10 text-brand-cacao/30" />
            )}
          </div>

          <label className="flex min-w-0 flex-col gap-2">
            <span className="text-xs font-black uppercase tracking-[0.16em] text-brand-cacao/45">
              URL guardada en la base
            </span>
            <input
              value={currentImage}
              onChange={(event) => updateDraft("image", event.target.value)}
              className="rounded-xl border border-brand-cacao/10 bg-white px-4 py-3 text-sm font-semibold text-brand-cacao outline-none transition focus:border-brand-hazelnut"
            />
          </label>
        </div>

        {imageError && (
          <p className="mb-4 rounded-xl bg-red-50 px-4 py-3 text-sm font-bold text-red-700">
            {imageError}
          </p>
        )}

        <div className="grid max-h-80 grid-cols-2 gap-3 overflow-y-auto pr-1 sm:grid-cols-3 lg:grid-cols-4">
          {blobImages.map((image) => (
            <button
              key={image.url}
              type="button"
              onClick={() => updateDraft("image", image.url)}
              className={`group overflow-hidden rounded-xl border bg-white text-left transition ${
                currentImage === image.url
                  ? "border-brand-cacao shadow-[0_0_0_2px_rgba(42,27,20,0.08)]"
                  : "border-brand-cacao/8 hover:border-brand-hazelnut/50"
              }`}
            >
              <span className="relative block aspect-[4/3] overflow-hidden bg-brand-cream">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={image.url} alt="" className="h-full w-full object-cover transition group-hover:scale-105" />
              </span>
              <span className="block truncate px-3 py-2 text-[11px] font-bold text-brand-cacao/65">
                {image.pathname}
              </span>
            </button>
          ))}
        </div>
      </div>
    );
  };

  const renderCheckbox = (label: string, field: string) => {
    if (!draft) return null;
    const checked = Boolean((draft as unknown as Record<string, boolean>)[field]);

    return (
      <label className="flex items-center gap-3 rounded-xl border border-brand-cacao/8 bg-white px-4 py-3 text-sm font-bold text-brand-cacao">
        <input
          type="checkbox"
          checked={checked}
          onChange={(event) => updateDraft(field, event.target.checked)}
          className="h-4 w-4 accent-brand-cacao"
        />
        {label}
      </label>
    );
  };

  const currentList =
    activeTab === "products"
      ? data.products
      : activeTab === "categories"
        ? data.categories
        : activeTab === "promotions"
          ? data.promotions
          : activeTab === "orders"
            ? data.orders
            : [data.businessInfo];

  return (
    <main className="min-h-screen bg-[#F5EFE8] text-brand-cacao">
      <header className="border-b border-brand-cacao/8 bg-brand-cacao px-5 py-6 text-brand-cream md:px-8">
        <div className="mx-auto flex max-w-7xl flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.2em] text-brand-pink">Administración</p>
            <h1 className="mt-2 font-serif text-4xl font-black tracking-tight">Central Donuts</h1>
          </div>
          <div className="flex flex-col gap-4 md:items-end">
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {stats.map((stat) => (
                <div key={stat.label} className="rounded-xl border border-white/10 bg-white/8 px-4 py-3">
                  <p className="text-xl font-black text-brand-pink">{stat.value}</p>
                  <p className="text-[11px] font-bold uppercase tracking-wide text-brand-cream/55">{stat.label}</p>
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={logout}
              disabled={isLoggingOut}
              className="inline-flex w-fit items-center gap-2 rounded-xl border border-white/10 bg-white/8 px-4 py-2 text-xs font-black uppercase tracking-wide text-brand-cream transition hover:bg-white/14 disabled:opacity-60"
            >
              <LogOut className="h-4 w-4" />
              {isLoggingOut ? "Saliendo" : "Cerrar sesión"}
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 px-5 py-6 md:px-8 lg:grid-cols-[280px_minmax(0,1fr)]">
        <aside className="flex flex-col gap-4">
          <nav className="grid grid-cols-2 gap-2 lg:grid-cols-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => selectTab(tab.id)}
                className={`flex items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-black transition ${
                  activeTab === tab.id
                    ? "bg-brand-cacao text-brand-cream shadow-[0_12px_28px_rgba(42,27,20,0.16)]"
                    : "bg-white text-brand-cacao/68 hover:text-brand-cacao"
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </nav>

          <div className="rounded-2xl bg-white p-3 shadow-sm">
            <div className="mb-3 flex items-center gap-2 px-2 text-xs font-black uppercase tracking-[0.16em] text-brand-cacao/45">
              <BadgeDollarSign className="h-4 w-4" />
              Registros
            </div>
            <div className="flex max-h-[520px] flex-col gap-2 overflow-y-auto pr-1">
              {currentList.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => selectEntity(item)}
                  className={`rounded-xl px-3 py-3 text-left transition ${
                    selectedId === item.id ? "bg-brand-pink text-brand-cacao" : "hover:bg-brand-cream"
                  }`}
                >
                  <p className="truncate text-sm font-black">
                    {getEntityTitle(item)}
                  </p>
                  <p className="mt-1 truncate text-xs font-semibold text-brand-cacao/55">
                    {getEntitySubtitle(item)}
                  </p>
                </button>
              ))}
            </div>
          </div>
        </aside>

        <section className="rounded-2xl bg-white p-5 shadow-sm md:p-7">
          <div className="mb-6 flex flex-col gap-3 border-b border-brand-cacao/8 pb-5 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.18em] text-brand-hazelnut">
                {tabs.find((tab) => tab.id === activeTab)?.label}
              </p>
              <h2 className="mt-1 font-serif text-3xl font-black">
                {draft ? getEntityTitle(draft) : "Sin registros"}
              </h2>
            </div>
            <div className="flex items-center gap-3">
              {saveState === "saved" && (
                <span className="inline-flex items-center gap-1.5 text-xs font-black text-green-700">
                  <Check className="h-4 w-4" />
                  Guardado
                </span>
              )}
              {saveState === "error" && <span className="text-xs font-black text-red-600">Error al guardar</span>}
              <button
                type="button"
                onClick={saveDraft}
                disabled={!draft || isSaving}
                className="inline-flex items-center gap-2 rounded-xl bg-brand-cacao px-5 py-3 text-sm font-black text-brand-cream transition hover:bg-brand-chocolate disabled:opacity-50"
              >
                <Save className="h-4 w-4" />
                {isSaving ? "Guardando" : "Guardar"}
              </button>
            </div>
          </div>

          {draft && activeTab === "products" && (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {renderInput("Nombre", "name")}
              {renderInput("Precio", "price", { type: "number" })}
              <label className="flex flex-col gap-2">
                <span className="text-xs font-black uppercase tracking-[0.16em] text-brand-cacao/45">Categoría</span>
                <select
                  value={(draft as AdminProduct).categoryId}
                  onChange={(event) => updateDraft("categoryId", event.target.value)}
                  className="rounded-xl border border-brand-cacao/10 bg-white px-4 py-3 text-sm font-semibold text-brand-cacao outline-none transition focus:border-brand-hazelnut"
                >
                  {data.categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </label>
              {renderInput("Badge", "badge")}
              {renderProductImagePicker()}
              {renderInput("SKU", "sku")}
              {renderInput("Stock", "stock", { type: "number" })}
              {renderInput("Orden", "sortOrder", { type: "number" })}
              <div className="grid grid-cols-1 gap-3 md:col-span-2 md:grid-cols-2">
                {renderCheckbox("Producto destacado", "isPopular")}
                {renderCheckbox("Disponible para vender", "isAvailable")}
              </div>
              <div className="md:col-span-2">{renderInput("Descripción", "description", { multiline: true })}</div>
            </div>
          )}

          {draft && activeTab === "categories" && (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {renderInput("Nombre", "name")}
              {renderInput("Slug", "slug")}
              {renderInput("Imagen", "image")}
              {renderInput("Orden", "sortOrder", { type: "number" })}
              {renderCheckbox("Activa", "isActive")}
              <div className="md:col-span-2">{renderInput("Descripción", "description", { multiline: true })}</div>
            </div>
          )}

          {draft && activeTab === "promotions" && (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {renderInput("Título", "title")}
              {renderInput("Slug", "slug")}
              <label className="flex flex-col gap-2">
                <span className="text-xs font-black uppercase tracking-[0.16em] text-brand-cacao/45">Tipo</span>
                <select
                  value={(draft as AdminPromotion).type}
                  onChange={(event) => updateDraft("type", event.target.value)}
                  className="rounded-xl border border-brand-cacao/10 bg-white px-4 py-3 text-sm font-semibold text-brand-cacao outline-none transition focus:border-brand-hazelnut"
                >
                  <option value="featured">Destacada</option>
                  <option value="badge">Badge</option>
                  <option value="discount">Descuento</option>
                  <option value="banner">Banner</option>
                </select>
              </label>
              <label className="flex flex-col gap-2">
                <span className="text-xs font-black uppercase tracking-[0.16em] text-brand-cacao/45">Categoría</span>
                <select
                  value={(draft as AdminPromotion).categoryId}
                  onChange={(event) => updateDraft("categoryId", event.target.value)}
                  className="rounded-xl border border-brand-cacao/10 bg-white px-4 py-3 text-sm font-semibold text-brand-cacao outline-none transition focus:border-brand-hazelnut"
                >
                  <option value="">Sin categoría</option>
                  {data.categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </label>
              {renderInput("Badge", "badgeText")}
              {renderInput("Descuento %", "discountPercent", { type: "number" })}
              {renderInput("Orden", "sortOrder", { type: "number" })}
              {renderCheckbox("Promoción activa", "isActive")}
              <div className="md:col-span-2">{renderInput("Descripción", "description", { multiline: true })}</div>
            </div>
          )}

          {draft && activeTab === "business" && (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {renderInput("Nombre", "name")}
              {renderInput("Marca", "brandDisplay")}
              {renderInput("Teléfono", "phone")}
              {renderInput("WhatsApp número", "whatsappNumber")}
              {renderInput("Instagram handle", "instagramHandle")}
              {renderInput("Instagram URL", "instagramUrl")}
              {renderInput("Dirección", "addressLine")}
              {renderInput("Ciudad", "city")}
              {renderInput("País", "country")}
              {renderInput("Google Maps", "mapsUrl")}
              {renderInput("Días", "openingDays")}
              {renderInput("Horarios", "openingHours")}
              {renderInput("Cierre", "closedNotice")}
              {renderInput("Nota delivery", "deliveryNote")}
              <div className="md:col-span-2">{renderInput("Descripción", "description", { multiline: true })}</div>
            </div>
          )}

          {draft && activeTab === "orders" && (
            <div className="flex flex-col gap-6">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {renderInput("Cliente", "customerName", { disabled: true })}
                {renderInput("WhatsApp", "customerPhone", { disabled: true })}
                {renderInput("Entrega", "deliveryMethod", { disabled: true })}
                {renderInput("Dirección", "deliveryAddress", { disabled: true })}
                <label className="flex flex-col gap-2">
                  <span className="text-xs font-black uppercase tracking-[0.16em] text-brand-cacao/45">Estado</span>
                  <select
                    value={(draft as AdminOrder).status}
                    onChange={(event) => updateDraft("status", event.target.value)}
                    className="rounded-xl border border-brand-cacao/10 bg-white px-4 py-3 text-sm font-semibold text-brand-cacao outline-none transition focus:border-brand-hazelnut"
                  >
                    <option value="pending">Pendiente</option>
                    <option value="paid_simulated">Pago simulado</option>
                    <option value="sent_to_whatsapp">Enviado a WhatsApp</option>
                    <option value="cancelled">Cancelado</option>
                  </select>
                </label>
                {renderInput("Total", "total", { disabled: true })}
              </div>

              <div className="rounded-2xl border border-brand-cacao/8">
                <div className="border-b border-brand-cacao/8 px-4 py-3 text-xs font-black uppercase tracking-[0.16em] text-brand-cacao/45">
                  Ítems del pedido
                </div>
                <div className="divide-y divide-brand-cacao/8">
                  {(draft as AdminOrder).items.map((item) => (
                    <div key={item.id} className="grid grid-cols-[1fr_auto] gap-4 px-4 py-3 text-sm">
                      <div>
                        <p className="font-black">{item.productName}</p>
                        <p className="text-xs font-semibold text-brand-cacao/55">
                          {item.quantity} x {formatPrice(item.unitPrice)}
                        </p>
                      </div>
                      <p className="font-black">{formatPrice(item.lineTotal)}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </section>
      </div>
    </main>
  );
};
