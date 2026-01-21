import os
import subprocess
import sys

# Configuration
PROTOS_ROOT = "protos"
OUT_DIR = "src/common/stubs"

# Map proto folders to output folders
MAPPINGS = {
    "auth": "auth",
    "user": "user"
}

def run_protoc():
    print("🚀 Starting Proto Generation...")
    
    try:
        import grpc_tools.protoc
    except ImportError:
        print("❌ Error: grpcio-tools not found. Run 'uv add --dev grpcio-tools'")
        sys.exit(1)

    for proto_folder, stub_folder in MAPPINGS.items():
        src_path = os.path.join(PROTOS_ROOT, proto_folder)
        out_path = os.path.join(OUT_DIR, stub_folder)
        
        os.makedirs(out_path, exist_ok=True)
        
        proto_files = [
            os.path.join(src_path, f) 
            for f in os.listdir(src_path) 
            if f.endswith(".proto")
        ]

        if not proto_files:
            continue

        print(f"   📂 Processing: {proto_folder} -> {out_path}")

        cmd = [
            sys.executable, "-m", "grpc_tools.protoc",
            f"-I{PROTOS_ROOT}",
            f"--python_out={OUT_DIR}/{stub_folder}",
            f"--grpc_python_out={OUT_DIR}/{stub_folder}",
            f"--mypy_out={OUT_DIR}/{stub_folder}",
            f"--mypy_grpc_out={OUT_DIR}/{stub_folder}",
        ] + proto_files

        result = subprocess.run(cmd)
        if result.returncode != 0:
            print(f"❌ Error compiling {proto_folder}")
            sys.exit(1)

    print("✅ Generation Complete.")

if __name__ == "__main__":
    run_protoc()