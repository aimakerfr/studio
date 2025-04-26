
'use client';

import * as React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Image from 'next/image';
import { Loader2, ToyBrick, Palette, Smile, PersonStanding, Shirt, VenetianMask, Package } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { generateImageAction, GenerateImageActionResult } from '@/app/actions';

// Adjusted Zod schema for client-side validation (File instance expected)
const formSchema = z.object({
  figureName: z.string().min(1, 'Figure name is required.'),
  primaryColor: z.string().min(1, 'Primary color is required. (e.g., Yellow, Blue)').default('Yellow'),
  shirtColor: z.string().min(1, 'Shirt color is required.').default('Light blue'),
  pantsColor: z.string().min(1, 'Pants color is required.').default('Dark'),
  beltColor: z.string().min(1, 'Belt color is required.').default('Brown'),
  shoesColor: z.string().min(1, 'Shoes color is required.').default('White'),
  hairDescription: z.string().min(1, 'Hair description is required.').default('Short, curly dark hair'),
  facialExpression: z.string().min(1, 'Facial expression is required.').default('Friendly'),
  backgroundColor: z.string().min(1, 'Background color is required.').default('Blue'),
  title: z.string().min(1, 'Title is required.').default('Software Expert'),
  titleColor: z.string().min(1, 'Title color is required.').default('White'),
  ageRestriction: z.string().min(1, 'Age restriction is required.').default('Ages 18 and up'),
  accessory1: z.string().min(1, 'Accessory 1 is required.').default('A removable Mac Studio'),
  accessory2: z.string().min(1, 'Accessory 2 is required.').default('A Play Station 5'),
  accessory3: z.string().min(1, 'Accessory 3 is required.').default('A 4k Monitor'),
  accessory4: z.string().min(1, 'Accessory 4 is required.').default('A pair of white speakers'),
  accessory5: z.string().min(1, 'Accessory 5 is required.').default('A white keyboard'),
  figurePhoto: z.instanceof(File).refine(file => file.size > 0, 'Figure photo is required.'), // Expecting a File object
});

type FormValues = z.infer<typeof formSchema>;

export default function CustomizationForm() {
  const [isLoading, setIsLoading] = React.useState(false);
  const [generatedImageUrl, setGeneratedImageUrl] = React.useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = React.useState<string | null>(null);
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { // Set default values based on example
      figureName: 'Darius Reed',
      primaryColor: 'Yellow',
      shirtColor: 'Light blue',
      pantsColor: 'Dark',
      beltColor: 'Brown',
      shoesColor: 'White',
      hairDescription: 'Short, curly dark hair',
      facialExpression: 'Friendly',
      backgroundColor: 'Blue',
      title: 'Software Expert',
      titleColor: 'White',
      ageRestriction: 'Ages 18 and up',
      accessory1: 'A removable Mac Studio',
      accessory2: 'A Play Station 5',
      accessory3: 'A 4k Monitor',
      accessory4: 'A pair of white speakers',
      accessory5: 'A white keyboard',
      figurePhoto: undefined, // No default file
    },
  });

  const { register, handleSubmit, control, watch, setValue } = form;

  const figurePhoto = watch('figurePhoto');

  React.useEffect(() => {
    if (figurePhoto && figurePhoto instanceof File) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(figurePhoto);
    } else {
      setPreviewUrl(null);
    }
  }, [figurePhoto]);


  const onSubmit = async (data: FormValues) => {
    setIsLoading(true);
    setGeneratedImageUrl(null); // Reset previous image

    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
        if (value instanceof File) {
            formData.append(key, value);
        } else {
            formData.append(key, value as string);
        }
    });


    try {
      const result: GenerateImageActionResult = await generateImageAction(formData);

      if (result.success) {
        setGeneratedImageUrl(result.imageUrl);
        toast({
          title: 'Success!',
          description: 'Your custom starter pack image has been generated.',
        });
      } else {
        toast({
          variant: 'destructive',
          title: 'Error Generating Image',
          description: result.error || 'An unknown error occurred.',
        });
        console.error("Form submission error:", result.error);
      }
    } catch (error) {
       console.error("Caught error during action call:", error);
      toast({
        variant: 'destructive',
        title: 'Submission Failed',
        description: error instanceof Error ? error.message : 'An unexpected error occurred.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4 md:p-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
       <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-bold flex items-center gap-2">
             <Package className="h-6 w-6"/> Customize Your Starter Pack
          </CardTitle>
          <CardDescription>Fill in the details below to create your unique action figure.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

              {/* Figure Details Section */}
              <div className="space-y-4 p-4 border rounded-lg shadow-sm">
                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2"><VenetianMask className="h-5 w-5" /> Figure Details</h3>
                 <FormField
                    control={control}
                    name="figureName"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Figure Name</FormLabel>
                        <FormControl>
                        <Input placeholder="e.g., Darius Reed" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
                 <FormField
                    control={control}
                    name="hairDescription"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Hair Description</FormLabel>
                        <FormControl>
                        <Input placeholder="e.g., Short, curly dark hair" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
                <FormField
                    control={control}
                    name="facialExpression"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Facial Expression</FormLabel>
                        <FormControl>
                        <Input placeholder="e.g., Friendly, Serious" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
              </div>


             {/* Clothing Section */}
             <div className="space-y-4 p-4 border rounded-lg shadow-sm">
                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2"><Shirt className="h-5 w-5" /> Clothing Colors</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                     <FormField
                        control={control}
                        name="shirtColor"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>Shirt Color</FormLabel>
                            <FormControl>
                            <Input placeholder="e.g., Light blue" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                     <FormField
                        control={control}
                        name="pantsColor"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>Pants Color</FormLabel>
                            <FormControl>
                            <Input placeholder="e.g., Dark" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                     <FormField
                        control={control}
                        name="beltColor"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>Belt Color</FormLabel>
                            <FormControl>
                            <Input placeholder="e.g., Brown" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                    <FormField
                        control={control}
                        name="shoesColor"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>Shoes Color</FormLabel>
                            <FormControl>
                            <Input placeholder="e.g., White" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                 </div>
             </div>


              {/* Packaging Section */}
               <div className="space-y-4 p-4 border rounded-lg shadow-sm">
                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2"><Palette className="h-5 w-5" /> Packaging Design</h3>
                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormField
                        control={control}
                        name="primaryColor"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>Packaging Primary Color</FormLabel>
                            <FormControl>
                            <Input placeholder="e.g., Yellow" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                     <FormField
                        control={control}
                        name="backgroundColor"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>Packaging Background Color</FormLabel>
                            <FormControl>
                            <Input placeholder="e.g., Blue" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                    <FormField
                        control={control}
                        name="title"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>Packaging Title</FormLabel>
                            <FormControl>
                            <Input placeholder="e.g., Software Expert" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                     <FormField
                        control={control}
                        name="titleColor"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>Title Color</FormLabel>
                            <FormControl>
                            <Input placeholder="e.g., White" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                    <FormField
                        control={control}
                        name="ageRestriction"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>Age Restriction</FormLabel>
                            <FormControl>
                            <Input placeholder="e.g., Ages 18 and up" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                 </div>
               </div>

              {/* Accessories Section */}
              <div className="space-y-4 p-4 border rounded-lg shadow-sm">
                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2"><ToyBrick className="h-5 w-5" /> Accessories</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {[1, 2, 3, 4, 5].map((i) => (
                    <FormField
                        key={i}
                        control={control}
                        name={`accessory${i}` as keyof FormValues}
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>{`Accessory ${i}`}</FormLabel>
                            <FormControl>
                            <Input placeholder={`e.g., Accessory ${i}`} {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                    ))}
                </div>
              </div>


               {/* Image Upload Section */}
               <div className="space-y-4 p-4 border rounded-lg shadow-sm">
                 <h3 className="text-lg font-semibold mb-3 flex items-center gap-2"><PersonStanding className="h-5 w-5" /> Figure Photo</h3>
                 <FormField
                    control={control}
                    name="figurePhoto"
                    render={({ field: { onChange, onBlur, name, ref } }) => (
                    <FormItem>
                        <FormLabel>Upload Photo</FormLabel>
                        <FormControl>
                        <Input
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                               const file = e.target.files?.[0];
                                if (file) {
                                    setValue("figurePhoto", file); // Use setValue to update RHF state
                                }
                            }}
                            onBlur={onBlur}
                            name={name}
                            ref={ref}
                            className="file:text-foreground"
                        />
                        </FormControl>
                        <FormDescription>Upload an image of the person for the action figure.</FormDescription>
                        <FormMessage />
                    </FormItem>
                    )}
                />
                {previewUrl && (
                    <div className="mt-4">
                        <Label>Photo Preview:</Label>
                        <Image src={previewUrl} alt="Figure preview" width={100} height={100} className="rounded-md border mt-2" />
                    </div>
                )}
               </div>


              <Button type="submit" disabled={isLoading} className="w-full">
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  'Generate Starter Pack Image'
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
       </Card>

      <Card className="shadow-lg flex flex-col items-center justify-center">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Generated Image</CardTitle>
          <CardDescription className="text-center">Your custom starter pack will appear here.</CardDescription>
        </CardHeader>
        <CardContent className="flex-grow flex items-center justify-center w-full">
          {isLoading ? (
            <div className="flex flex-col items-center gap-4 text-muted-foreground">
              <Loader2 className="h-16 w-16 animate-spin" />
              <p>Generating your awesome action figure...</p>
            </div>
          ) : generatedImageUrl ? (
            <Image
              src={generatedImageUrl}
              alt="Generated Action Figure"
              width={512} // Adjust size as needed
              height={512} // Adjust size as needed
              className="rounded-lg border shadow-md object-contain max-w-full max-h-[60vh]" // Ensure image fits
              priority // Prioritize loading the generated image
            />
          ) : (
             <div className="text-center text-muted-foreground p-8 border-2 border-dashed rounded-lg">
              <Package className="h-16 w-16 mx-auto mb-4" />
              <p>Your generated image will be displayed here once created.</p>
            </div>
          )}
        </CardContent>
         {generatedImageUrl && !isLoading && (
             <CardFooter className="w-full justify-center">
                <Button asChild variant="outline">
                 <a href={generatedImageUrl} download={`starter-pack-${form.getValues('figureName') || 'custom'}.png`} target="_blank" rel="noopener noreferrer">
                    Download Image
                 </a>
                 </Button>
            </CardFooter>
         )}
      </Card>
    </div>
  );
}
