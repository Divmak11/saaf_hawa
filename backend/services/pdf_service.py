from reportlab.lib.pagesizes import letter, A4
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, HRFlowable
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER, TA_LEFT, TA_RIGHT, TA_JUSTIFY
from io import BytesIO
from datetime import datetime
import os

class PDFService:
    @staticmethod
    def generate_petition_pdf(signature) -> BytesIO:
        """Generate PDF for signed petition"""
        buffer = BytesIO()
        doc = SimpleDocTemplate(
            buffer, 
            pagesize=letter,
            leftMargin=0.75*inch,
            rightMargin=0.75*inch,
            topMargin=0.75*inch,
            bottomMargin=0.75*inch
        )
        styles = getSampleStyleSheet()
        story = []
        
        # Custom styles - Simple and professional
        title_style = ParagraphStyle(
            'CustomTitle',
            parent=styles['Heading1'],
            fontSize=24,
            textColor=colors.black,
            spaceAfter=10,
            alignment=TA_CENTER,
            fontName='Helvetica-Bold',
            leading=28
        )
        
        header_style = ParagraphStyle(
            'CustomHeader',
            parent=styles['Heading2'],
            fontSize=14,
            textColor=colors.black,
            spaceAfter=10,
            fontName='Helvetica-Bold'
        )
        
        body_style = ParagraphStyle(
            'CustomBody',
            parent=styles['BodyText'],
            fontSize=11,
            textColor=colors.HexColor('#333333'),
            spaceAfter=14,
            alignment=TA_JUSTIFY,
            leading=18
        )
        
        emphasis_style = ParagraphStyle(
            'EmphasisBody',
            parent=body_style,
            fontSize=12,
            fontName='Helvetica-Bold',
            textColor=colors.black
        )
        
        # Simple header
        story.append(Spacer(1, 0.3*inch))
        story.append(Paragraph("CLEAN AIR! MY RIGHT", title_style))
        story.append(HRFlowable(width="100%", thickness=1, color=colors.grey, spaceAfter=20, spaceBefore=10))
        
        # Signature info box
        info_data = [[f"Signature Number: #{signature.signature_number}", f"Date: {signature.timestamp.strftime('%B %d, %Y')}"]]
        info_table = Table(info_data, colWidths=[3.5*inch, 3*inch])
        info_table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, -1), colors.HexColor('#f5f5f5')),
            ('TEXTCOLOR', (0, 0), (-1, -1), colors.black),
            ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
            ('FONTNAME', (0, 0), (-1, -1), 'Helvetica-Bold'),
            ('FONTSIZE', (0, 0), (-1, -1), 10),
            ('PADDING', (0, 0), (-1, -1), 12),
            ('BOX', (0, 0), (-1, -1), 1, colors.grey)
        ]))
        story.append(info_table)
        story.append(Spacer(1, 0.4*inch))
        
        # Petition letter
        story.append(Paragraph("<b>TO:</b>", ParagraphStyle('ToStyle', parent=body_style, fontSize=10, textColor=colors.grey)))
        story.append(Paragraph("Kind Attention Prime Minister, Chief Minister & the Leader of Opposition", header_style))
        story.append(Spacer(1, 0.3*inch))
        
        # Letter content
        letter_paragraphs = [
            ("I am signing this because the air in Delhi has become a daily health threat for my family. The coughing, the burning throat, the breathlessness, these are now part of our lives. What makes it worse is that the AQI shown to us often does not match what we feel in our lungs.", body_style),
            ("Please don't hiding the reality of our air. Please ensure that AQI data is not manipulated.", emphasis_style),
            ("give us the truth so we can protect our children and elders. Treat this as the health emergency it is. Delhi deserves honest data and real action. We want you to act and take strong measures rather than Band-Aid solutions.", body_style),
            ("Clean air is my fundamental right. Please protect it.", emphasis_style)
        ]
        
        for para_text, para_style in letter_paragraphs:
            story.append(Paragraph(para_text, para_style))
            story.append(Spacer(1, 0.15*inch))
        
        story.append(Spacer(1, 0.4*inch))
        story.append(HRFlowable(width="100%", thickness=1, lineCap='round', color=colors.grey, spaceAfter=20, spaceBefore=10, dash=[5, 3]))
        
        story.append(Paragraph("Sincerely,", body_style))
        story.append(Spacer(1, 0.2*inch))
        
        # Signature details table
        sig_data = [
            ["SIGNED BY:", signature.name],
            ["Phone:", signature.phone]
        ]
        sig_table = Table(sig_data, colWidths=[1.5*inch, 5*inch])
        sig_table.setStyle(TableStyle([
            ('TEXTCOLOR', (0, 0), (0, -1), colors.grey),
            ('TEXTCOLOR', (1, 0), (1, 0), colors.black),
            ('FONTNAME', (0, 0), (0, -1), 'Helvetica-Bold'),
            ('FONTNAME', (1, 0), (1, 0), 'Helvetica-Bold'),
            ('FONTSIZE', (0, 0), (0, -1), 10),
            ('FONTSIZE', (1, 0), (1, 0), 14),
            ('FONTSIZE', (1, 1), (1, -1), 11),
            ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
            ('VALIGN', (0, 0), (-1, -1), 'TOP'),
            ('TOPPADDING', (0, 0), (-1, -1), 6),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 6),
            ('LEFTPADDING', (0, 0), (-1, -1), 0),
            ('RIGHTPADDING', (0, 0), (-1, -1), 0)
        ]))
        story.append(sig_table)
        
        # Footer
        story.append(Spacer(1, 0.6*inch))
        story.append(HRFlowable(width="100%", thickness=1, color=colors.grey, spaceAfter=15))
        footer_style = ParagraphStyle(
            'Footer',
            parent=styles['Normal'],
            fontSize=9,
            textColor=colors.grey,
            alignment=TA_CENTER,
            leading=14
        )
        story.append(Paragraph("A citizen-led movement demanding honest AQI data and real action on Delhi's air pollution crisis.", footer_style))
        story.append(Paragraph("© 2025 Saaf Hawa | Citizen-led initiative", footer_style))
        
        # Build PDF
        doc.build(story)
        buffer.seek(0)
        return buffer
