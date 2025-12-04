from PIL import Image, ImageDraw, ImageFont
from io import BytesIO
from datetime import datetime
import textwrap

class ImageService:
    @staticmethod
    def generate_petition_image(signature) -> BytesIO:
        """Generate image for signed petition"""
        # Create larger image for better quality
        width, height = 1200, 1800
        img = Image.new('RGB', (width, height), color='white')
        draw = ImageDraw.Draw(img)
        
        # Try to use better fonts, fallback to default
        try:
            title_font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 56)
            subtitle_font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf", 28)
            heading_font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 26)
            body_font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf", 20)
            small_font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf", 16)
            tiny_font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf", 14)
        except:
            title_font = ImageFont.load_default()
            subtitle_font = ImageFont.load_default()
            heading_font = ImageFont.load_default()
            body_font = ImageFont.load_default()
            small_font = ImageFont.load_default()
            tiny_font = ImageFont.load_default()
        
        y_position = 40
        padding = 60
        
        # Header background
        draw.rectangle([(0, 0), (width, 160)], fill='black')
        
        # Title
        title_text = "CLEAN AIR! MY RIGHT"
        title_bbox = draw.textbbox((0, 0), title_text, font=title_font)
        title_width = title_bbox[2] - title_bbox[0]
        draw.text(((width - title_width) / 2, 30), title_text, fill='white', font=title_font)
        
        # No subtitle - removed Hindi text as per requirements
        
        y_position = 200
        
        # Info box background
        draw.rectangle([(padding, y_position), (width - padding, y_position + 60)], fill='#f5f5f5', outline='#cccccc', width=2)
        
        # Signature number and date
        draw.text((padding + 20, y_position + 18), f"Signature #{signature.signature_number}", fill='black', font=heading_font)
        date_text = signature.timestamp.strftime('%B %d, %Y')
        date_bbox = draw.textbbox((0, 0), f"Date: {date_text}", font=heading_font)
        date_width = date_bbox[2] - date_bbox[0]
        draw.text((width - padding - date_width - 20, y_position + 18), f"Date: {date_text}", fill='black', font=heading_font)
        
        y_position += 100
        
        # TO section
        draw.text((padding, y_position), "TO:", fill='#888888', font=tiny_font)
        y_position += 35
        draw.text((padding, y_position), "Kind Attention Prime Minister, Chief Minister &", fill='black', font=heading_font)
        y_position += 35
        draw.text((padding, y_position), "the Leader of Opposition", fill='black', font=heading_font)
        
        y_position += 70
        
        # Letter content with better formatting
        letter_paragraphs = [
            "I am signing this because the air in Delhi has become a daily health threat for my family. The coughing, the burning throat, the breathlessness, these are now part of our lives. What makes it worse is that the AQI shown to us often does not match what we feel in our lungs.",
            "Please don't hiding the reality of our air. Please ensure that AQI data is not manipulated.",
            "give us the truth so we can protect our children and elders. Treat this as the health emergency it is. Delhi deserves honest data and real action. We want you to act and take strong measures rather than Band-Aid solutions.",
            "Clean air is my fundamental right. Please protect it."
        ]
        
        max_width = width - (2 * padding)
        
        for i, paragraph in enumerate(letter_paragraphs):
            # Wrap text
            words = paragraph.split()
            lines = []
            current_line = []
            
            for word in words:
                test_line = ' '.join(current_line + [word])
                bbox = draw.textbbox((0, 0), test_line, font=body_font)
                if bbox[2] - bbox[0] <= max_width:
                    current_line.append(word)
                else:
                    if current_line:
                        lines.append(' '.join(current_line))
                    current_line = [word]
            if current_line:
                lines.append(' '.join(current_line))
            
            # Draw lines
            for line in lines:
                # Bold for emphasis paragraphs
                if i in [1, 3]:
                    draw.text((padding, y_position), line, fill='black', font=heading_font)
                else:
                    draw.text((padding, y_position), line, fill='#333333', font=body_font)
                y_position += 32
            
            y_position += 20
        
        y_position += 30
        
        # Signature section with dashed line
        for x in range(padding, width - padding, 20):
            draw.line([(x, y_position), (min(x + 10, width - padding), y_position)], fill='#cccccc', width=2)
        y_position += 30
        
        draw.text((padding, y_position), "SIGNED BY:", fill='#888888', font=tiny_font)
        y_position += 40
        
        draw.text((padding, y_position), signature.name, fill='black', font=heading_font)
        y_position += 40
        
        draw.text((padding, y_position), f"Phone: {signature.phone}", fill='#555555', font=body_font)
        y_position += 50
        
        # Footer
        footer_y = height - 110
        draw.line([(padding, footer_y), (width - padding, footer_y)], fill='#cccccc', width=2)
        footer_y += 25
        
        footer_text = "A citizen-led movement demanding honest AQI data and real action on Delhi's air pollution crisis"
        footer_bbox = draw.textbbox((0, 0), footer_text, font=small_font)
        footer_width = footer_bbox[2] - footer_bbox[0]
        draw.text(((width - footer_width) / 2, footer_y), footer_text, fill='#888888', font=small_font)
        
        footer_text2 = "© 2025 Saaf Hawa | Citizen-led initiative"
        footer_bbox2 = draw.textbbox((0, 0), footer_text2, font=small_font)
        footer_width2 = footer_bbox2[2] - footer_bbox2[0]
        draw.text(((width - footer_width2) / 2, footer_y + 30), footer_text2, fill='#999999', font=small_font)
        
        # Save to buffer
        buffer = BytesIO()
        img.save(buffer, format='PNG')
        buffer.seek(0)
        return buffer
