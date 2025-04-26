
'use server';

import { z } from 'zod';
import { generateActionFigureImage } from '@/ai/flows/generate-action-figure-image';

// Re-define schema slightly for server-side validation, ensuring file handling
const GenerateActionFigureImageInputSchemaServer = z.object({
  figureName: z.string().min(1, 'Figure name is required.'),
  primaryColor: z.string().min(1, 'Primary color is required.'),
  shirtColor: z.string().min(1, 'Shirt color is required.'),
  pantsColor: z.string().min(1, 'Pants color is required.'),
  beltColor: z.string().min(1, 'Belt color is required.'),
  shoesColor: z.string().min(1, 'Shoes color is required.'),
  hairDescription: z.string().min(1, 'Hair description is required.'),
  facialExpression: z.string().min(1, 'Facial expression is required.'),
  backgroundColor: z.string().min(1, 'Background color is required.'),
  title: z.string().min(1, 'Title is required.'),
  titleColor: z.string().min(1, 'Title color is required.'),
  ageRestriction: z.string().min(1, 'Age restriction is required.'),
  accessory1: z.string().min(1, 'Accessory 1 is required.'),
  accessory2: z.string().min(1, 'Accessory 2 is required.'),
  accessory3: z.string().min(1, 'Accessory 3 is required.'),
  accessory4: z.string().min(1, 'Accessory 4 is required.'),
  accessory5: z.string().min(1, 'Accessory 5 is required.'),
  figurePhoto: z.instanceof(File).refine(file => file.size > 0, 'Figure photo is required.'),
});

export type GenerateImageActionResult =
  | { success: true; imageUrl: string }
  | { success: false; error: string };


// Helper function to convert File to Base64 Data URI
async function fileToDataUri(file: File): Promise<string> {
    const buffer = Buffer.from(await file.arrayBuffer());
    const base64 = buffer.toString('base64');
    return `data:${file.type};base64,${base64}`;
}


export async function generateImageAction(
  formData: FormData,
): Promise<GenerateImageActionResult> {
  const rawData = Object.fromEntries(formData.entries());

  const parseResult = GenerateActionFigureImageInputSchemaServer.safeParse(rawData);

  if (!parseResult.success) {
    console.error("Validation Errors:", parseResult.error.errors);
    // Flatten errors for a simpler message
    const errorMessages = parseResult.error.errors.map(e => `${e.path.join('.')}: ${e.message}`).join('; ');
    return { success: false, error: `Invalid input: ${errorMessages}` };
  }

  const validatedData = parseResult.data;

  try {
    const figurePhotoDataUri = await fileToDataUri(validatedData.figurePhoto);

    const aiInput = {
      ...validatedData,
      figurePhotoDataUri: figurePhotoDataUri, // Use the converted data URI
    };

    // Remove figurePhoto field as the AI flow expects figurePhotoDataUri
    delete (aiInput as any).figurePhoto;

    console.log("Calling Genkit AI flow with input:", {
        ...aiInput,
        figurePhotoDataUri: '[Data URI omitted for brevity]' // Avoid logging large data URI
    });

    const result = await generateActionFigureImage(aiInput);

    console.log("Genkit AI flow result:", result);


    if (result && result.imageUrl) {
      return { success: true, imageUrl: result.imageUrl };
    } else {
      console.error("Genkit AI flow returned unexpected result:", result);
      return { success: false, error: 'Failed to generate image. AI service might be down or returned an invalid response.' };
    }
  } catch (error) {
    console.error('Error generating image:', error);
    // Provide a more specific error message if possible
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred during image generation.';
    return { success: false, error: `Error generating image: ${errorMessage}` };
  }
}
