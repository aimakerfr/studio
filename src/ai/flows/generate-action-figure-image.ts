'use server';
/**
 * @fileOverview Generates a custom action figure image in a blister pack based on user input.
 *
 * - generateActionFigureImage - A function that generates the action figure image.
 * - GenerateActionFigureImageInput - The input type for the generateActionFigureImage function.
 * - GenerateActionFigureImageOutput - The return type for the generateActionFigureImage function.
 */

import {ai} from '@/ai/ai-instance';
import {z} from 'genkit';

const GenerateActionFigureImageInputSchema = z.object({
  figureName: z.string().describe('The name of the action figure.'),
  primaryColor: z.string().describe('The primary color of the packaging.'),
  shirtColor: z.string().describe('The color of the action figure shirt.'),
  pantsColor: z.string().describe('The color of the action figure pants.'),
  beltColor: z.string().describe('The color of the action figure belt.'),
  shoesColor: z.string().describe('The color of the action figure shoes.'),
  hairDescription: z.string().describe('The description of the action figure hair.'),
  facialExpression: z.string().describe('The facial expression of the action figure.'),
  backgroundColor: z.string().describe('The background color of the packaging.'),
  title: z.string().describe('The title printed on the packaging.'),
  titleColor: z.string().describe('The color of the title on the packaging.'),
  ageRestriction: z.string().describe('The age restriction printed on the packaging.'),
  accessory1: z.string().describe('The first accessory included in the packaging.'),
  accessory2: z.string().describe('The second accessory included in the packaging.'),
  accessory3: z.string().describe('The third accessory included in the packaging.'),
  accessory4: z.string().describe('The fourth accessory included in the packaging.'),
  accessory5: z.string().describe('The fifth accessory included in the packaging.'),
  figurePhotoDataUri: z
    .string()
    .describe(
      "A photo of the action figure, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type GenerateActionFigureImageInput = z.infer<
  typeof GenerateActionFigureImageInputSchema
>;

const GenerateActionFigureImageOutputSchema = z.object({
  imageUrl: z.string().describe('The URL of the generated action figure image.'),
});
export type GenerateActionFigureImageOutput = z.infer<
  typeof GenerateActionFigureImageOutputSchema
>;

export async function generateActionFigureImage(
  input: GenerateActionFigureImageInput
): Promise<GenerateActionFigureImageOutput> {
  return generateActionFigureImageFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateActionFigureImagePrompt',
  input: {
    schema: z.object({
      figureName: z.string().describe('The name of the action figure.'),
      primaryColor: z.string().describe('The primary color of the packaging.'),
      shirtColor: z.string().describe('The color of the action figure shirt.'),
      pantsColor: z.string().describe('The color of the action figure pants.'),
      beltColor: z.string().describe('The color of the action figure belt.'),
      shoesColor: z.string().describe('The color of the action figure shoes.'),
      hairDescription: z.string().describe('The description of the action figure hair.'),
      facialExpression: z.string().describe('The facial expression of the action figure.'),
      backgroundColor: z.string().describe('The background color of the packaging.'),
      title: z.string().describe('The title printed on the packaging.'),
      titleColor: z.string().describe('The color of the title on the packaging.'),
      ageRestriction: z.string().describe('The age restriction printed on the packaging.'),
      accessory1: z.string().describe('The first accessory included in the packaging.'),
      accessory2: z.string().describe('The second accessory included in the packaging.'),
      accessory3: z.string().describe('The third accessory included in the packaging.'),
      accessory4: z.string().describe('The fourth accessory included in the packaging.'),
      accessory5: z.string().describe('The fifth accessory included in the packaging.'),
      figurePhotoDataUri: z
        .string()
        .describe(
          "A photo of the action figure, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
        ),
    }),
  },
  output: {
    schema: z.object({
      imageUrl: z.string().describe('The URL of the generated action figure image.'),
    }),
  },
  prompt: `You are an expert toy designer specializing in action figure packaging.

You will use the following information to create a high-quality mockup of a collectible action figure package.

Create a high-quality mockup of a collectible action figure package titled '{{figureName}}' in {{primaryColor}}. Use the provided photos as the base for the action figure. The packaging features a figure wearing a buttoned shirt {{shirtColor}}, jeans {{pantsColor}}, a belt {{beltColor}}, and sneakers {{shoesColor}}. The figure has {{hairDescription}} and a {{facialExpression}} expression. The packaging design includes a {{backgroundColor}} background. The name '{{title}}' is printed in {{titleColor}} in the top left corner, and '{{ageRestriction}}' in the top right corner. Inside the packaging, include: {{accessory1}}, {{accessory2}}, {{accessory3}}, {{accessory4}}, and {{accessory5}}.

Photo: {{media url=figurePhotoDataUri}}

Design the packaging to resemble a classic retro action figure blister pack, with clear plastic compartments for each accessory and a hanging hole cut out in the center of the top. Return just the URL of the image.
`,
});

const generateActionFigureImageFlow = ai.defineFlow<
  typeof GenerateActionFigureImageInputSchema,
  typeof GenerateActionFigureImageOutputSchema
>(
  {
    name: 'generateActionFigureImageFlow',
    inputSchema: GenerateActionFigureImageInputSchema,
    outputSchema: GenerateActionFigureImageOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
