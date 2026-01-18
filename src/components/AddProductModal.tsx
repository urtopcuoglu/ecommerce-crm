import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus } from "lucide-react";

// Form Validasyon Schema'sı
const productFormSchema = z.object({
    name: z.string().min(3, "Ürün adı en az 3 karakter olmalıdır"),
    sku: z.string().min(1, "SKU gereklidir"),
    baseCost: z.number().min(0, "Maliyet 0'dan küçük olamaz"),
    platforms: z.array(z.object({
        platformName: z.string(),
        listingPrice: z.number().min(0),
        commissionRate: z.number().min(0),
        shippingCost: z.number().min(0),
        stock: z.number().min(0),
        isActive: z.boolean()
    }))
});

type ProductFormData = z.infer<typeof productFormSchema>;

export function AddProductModal() {
    const { register, handleSubmit, formState: { errors } } = useForm<ProductFormData>({
        resolver: zodResolver(productFormSchema),
        mode: "onBlur",
        defaultValues: {
            platforms: [
                { platformName: "Trendyol", listingPrice: 0, commissionRate: 20, shippingCost: 45, stock: 0, isActive: true },
                { platformName: "Hepsiburada", listingPrice: 0, commissionRate: 18, shippingCost: 40, stock: 0, isActive: true }
            ]
        }
    });

    const onSubmit = (data: ProductFormData) => {
        console.log("Kaydedilecek Ürün:", data);
        // Burada backend (.NET API) isteği atılacak
    };

    return (
        <Dialog>
            <DialogTrigger asChild>
                <button className="bg-blue-600 text-white px-5 py-2.5 rounded-lg hover:bg-blue-700 shadow-sm font-medium flex items-center gap-2">
                    <Plus size={18} />
                    Yeni Ürün Ekle
                </button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-2xl">Yeni Ürün Tanımla</DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    {/* Genel Bilgiler Bölümü */}
                    <div className="grid grid-cols-2 gap-4 border-b pb-6">
                        <div className="col-span-2 space-y-2">
                            <Label>Ürün Adı</Label>
                            <Input {...register("name")} placeholder="Örn: Oversize Siyah Tişört" />
                            {errors.name && <p className="text-red-500 text-xs">{errors.name.message as string}</p>}
                        </div>
                        <div className="space-y-2">
                            <Label>SKU (Stok Kodu)</Label>
                            <Input {...register("sku")} placeholder="TSH-001" />
                        </div>
                        <div className="space-y-2">
                            <Label>Alış Maliyeti (₺)</Label>
                            <Input type="number" {...register("baseCost", { valueAsNumber: true })} />
                        </div>
                    </div>

                    {/* Platform Bazlı Fiyatlandırma */}
                    <div className="space-y-4">
                        <Label className="text-lg font-bold">Platform Ayarları</Label>
                        <Tabs defaultValue="Trendyol">
                            <TabsList className="w-full">
                                <TabsTrigger value="Trendyol" className="flex-1">Trendyol</TabsTrigger>
                                <TabsTrigger value="Hepsiburada" className="flex-1">Hepsiburada</TabsTrigger>
                            </TabsList>

                            {/* Trendyol Örneği (Dinamik hale getirilecek) */}
                            <TabsContent value="Trendyol" className="p-4 border rounded-md space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label>Satış Fiyatı (₺)</Label>
                                        <Input type="number" {...register("platforms.0.listingPrice", { valueAsNumber: true })} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Komisyon Oranı (%)</Label>
                                        <Input type="number" {...register("platforms.0.commissionRate", { valueAsNumber: true })} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Kargo Ücreti (₺)</Label>
                                        <Input type="number" {...register("platforms.0.shippingCost", { valueAsNumber: true })} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Stok Adedi</Label>
                                        <Input type="number" {...register("platforms.0.stock", { valueAsNumber: true })} />
                                    </div>
                                </div>
                            </TabsContent>
                        </Tabs>
                    </div>

                    <div className="flex justify-end gap-3 pt-4">
                        <button type="button" className="px-4 py-2 border rounded-md hover:bg-slate-50">İptal</button>
                        <button type="submit" className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 font-bold">
                            Ürünü Oluştur ve Yayınla
                        </button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}