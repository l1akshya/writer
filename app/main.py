import os
import subprocess
from typing import Dict, List
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

PLACEHOLDERS = {
    "Place_Holder_Name": "Name",
    "Place_Holder_contact": "Contact Number",
    "Place_Holder_Mail": "Email",
    "Place_Holder_linkedin": "LinkedIn Profile",
    "Place_Holder_github": "GitHub Profile"
}

# Set folder paths - these should be configured based on your deployment
TEMPLATE_FOLDER = r"C:\Users\DELL\OneDrive\Desktop\writer\Tempelates"
OUTPUT_FOLDER = r"C:\Users\DELL\OneDrive\Desktop\writer\outputs"

class TemplateData(BaseModel):
    template_name: str
    placeholder_values: Dict[str, str]
    output_filename: str

@app.get("/")
async def root():
    """Root endpoint to verify API is running."""
    return {"message": "LaTeX Template Processing API is running"}

@app.get("/templates", response_model=Dict[int, str])
async def list_templates():
    """Lists all available LaTeX templates."""
    if not os.path.isdir(TEMPLATE_FOLDER):
        raise HTTPException(status_code=404, detail="Template folder not found")
    
    text_files = [f for f in os.listdir(TEMPLATE_FOLDER) if f.endswith(".txt")]
    
    if not text_files:
        raise HTTPException(status_code=404, detail="No templates found")
    
    return {i + 1: file for i, file in enumerate(text_files)}

@app.get("/placeholders")
async def get_placeholders():
    """Returns the list of available placeholders."""
    return PLACEHOLDERS

@app.post("/generate-pdf")
async def generate_pdf(template_data: TemplateData):
    """Generates a PDF from a template with provided placeholder values."""
    # Validate template exists
    template_path = os.path.join(TEMPLATE_FOLDER, template_data.template_name)
    if not os.path.exists(template_path):
        raise HTTPException(status_code=404, detail="Template not found")
    
    try:
        # Read template
        with open(template_path, "r", encoding="utf-8") as f:
            latex_code = f.read()
        
        # Replace placeholders
        modified_code = latex_code
        for placeholder, value in template_data.placeholder_values.items():
            if placeholder in PLACEHOLDERS.keys():
                modified_code = modified_code.replace(placeholder, value)
        
        # Ensure output directory exists
        os.makedirs(OUTPUT_FOLDER, exist_ok=True)
        
        # Create output filename
        output_filename = template_data.output_filename
        if not output_filename.endswith('.pdf'):
            output_filename += '.pdf'
        
        # Create temporary tex file
        tex_file_path = os.path.join(OUTPUT_FOLDER, output_filename.replace(".pdf", ".tex"))
        with open(tex_file_path, "w", encoding="utf-8") as f:
            f.write(modified_code)
        
        # Generate PDF
        process = subprocess.run(
            ["pdflatex", "-output-directory", OUTPUT_FOLDER, tex_file_path],
            capture_output=True,
            text=True,
            check=True
        )
        
        # Check if PDF was created
        pdf_path = os.path.join(OUTPUT_FOLDER, output_filename)
        if not os.path.exists(pdf_path):
            raise HTTPException(status_code=500, detail="Failed to generate PDF")
        
        return {"message": "PDF generated successfully", "path": pdf_path}
        
    except subprocess.CalledProcessError as e:
        raise HTTPException(
            status_code=500,
            detail=f"LaTeX compilation failed: {e.stderr}"
        )
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error generating PDF: {str(e)}"
        )

if __name__ == "__main__":
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)