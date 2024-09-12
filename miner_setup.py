import logging
import os
import platform
import shutil
import subprocess
import sys

# Set up logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

def run_command(command, shell=False):
    """Utility function to run a shell command and log its output in real-time."""
    if shell:
        logging.info(f"Executing command: {command}")
        process = subprocess.Popen(command, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True, shell=True)
    else:
        logging.info(f"Executing command: {' '.join(command)}")
        process = subprocess.Popen(command, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True)

    # Log stdout in real-time
    for stdout_line in iter(process.stdout.readline, ""):
        logging.info(stdout_line.strip())  # Log each line of the standard output
    process.stdout.close()

    # Log stderr in real-time
    for stderr_line in iter(process.stderr.readline, ""):
        logging.error(stderr_line.strip())  # Log each line of the error output
    process.stderr.close()

    return_code = process.wait()
    if return_code != 0:
        raise subprocess.CalledProcessError(return_code, command)

def check_git_lfs():
    """Function to check if git-lfs is installed and install it if not."""
    logging.info("Checking if git-lfs is installed.")
    try:
        run_command(['git-lfs'])
        logging.info("git-lfs is already installed.")
    except subprocess.CalledProcessError:
        logging.info("git-lfs could not be found, installing...")
        if platform.system() == "Linux":
            if shutil.which("sudo"):
                run_command(["curl", "-s", "https://packagecloud.io/install/repositories/github/git-lfs/script.deb.sh", "|", "sudo", "bash"], shell=True)
                run_command(["sudo", "apt-get", "install", "git-lfs", "-y"])
            else:
                run_command(["curl", "-s", "https://packagecloud.io/install/repositories/github/git-lfs/script.deb.sh", "|", "bash"], shell=True)
                run_command(["apt-get", "install", "git-lfs", "-y"])
        elif platform.system() == "Darwin":
            run_command(["brew", "install", "git-lfs"])
        elif platform.system() == "Windows":
            logging.error("Please install Git LFS manually from https://git-lfs.github.com/")
            sys.exit(1)
        run_command(["git", "lfs", "install"])

def run_local(username, password, wallet_address, miner_dir):
    """Function to execute commands locally."""
    logging.info(f"Running locally with username: {username}, wallet_address: {wallet_address}, miner_dir: {miner_dir}")
    
    # Create the workers directory if it doesn't exist
    workers_dir = os.path.join(miner_dir, 'workers')
    if not os.path.exists(workers_dir):
        logging.info(f"Creating workers directory: {workers_dir}")
        os.makedirs(workers_dir)
    
    miner_repo_dir = os.path.join(workers_dir, "myowngpt-miner")

    if not os.path.exists(miner_repo_dir):
        logging.info(f"Creating miner repository directory: {miner_repo_dir}")
        os.makedirs(miner_repo_dir)

    os.chdir(miner_repo_dir)
    logging.info(f"Changed directory to: {miner_repo_dir}")

    # Check if the directory is a Git repository
    if os.path.exists(os.path.join(miner_repo_dir, ".git")):
        logging.info("Resetting and pulling latest code from the repository.")
        run_command(["git", "reset", "--hard"])
        run_command(["git", "pull"])
    else:
        logging.info("Cloning the repository.")
        run_command(["git", "clone", "https://github.com/bigideainc/myowngpt.git", "."])  # Note the "." to clone into the current directory
    
    # Change to the directory where requirements.txt is located
    logging.info(f"Changing directory to: {os.path.join(miner_repo_dir, 'Backend', 'miner-program')}")
    os.chdir(os.path.join(miner_repo_dir, "Backend", "miner-program"))

    check_git_lfs()

    if not os.path.exists("venv"):
        logging.info("Creating a virtual environment.")
        run_command([sys.executable, "-m", "venv", "venv"])

    # Activate the virtual environment
    if platform.system() == "Windows":
        activate_script = os.path.join("venv", "Scripts", "activate.bat")
        logging.info("Activating the virtual environment.")
        run_command([activate_script], shell=True)
    else:
        activate_script = os.path.join("venv", "bin", "activate")
        logging.info("Activating the virtual environment.")
        run_command(f"source {activate_script}", shell=True)
    
    logging.info("Virtual environment activated successfully.")
    
    # Upgrade pip using python -m pip
    logging.info("Upgrading pip.")
    run_command([sys.executable, "-m", "pip", "install", "--upgrade", "pip"])
    
    # Install dependencies from requirements.txt
    requirements_path = os.path.join(miner_repo_dir, "Backend", "miner-program", "requirements.txt")
    logging.info(f"Installing dependencies from {requirements_path}. This may take some time depending on the number of dependencies.")
    run_command([sys.executable, "-m", "pip", "install", "-r", requirements_path, "--verbose"])
    
    # Start the miner program after setup
    logging.info("Starting the miner program.")
    run_command([sys.executable, "auth/trainer.py", "--username", username, "--password", password, "--wallet_address", wallet_address])

def run_remote(ssh_details, username, password, wallet_address):
    """Function to execute commands remotely using SSH."""
    logging.info(f"Running remotely with SSH details: {ssh_details}, username: {username}, wallet_address: {wallet_address}")
    ssh_command = f"""
    if [ -d 'myowngpt-miner' ]; then
        cd myowngpt-miner/Backend/miner-program
        git reset --hard
        git pull
    else:
        git clone https://github.com/bigideainc/myowngpt.git myowngpt-miner
        cd myowngpt-miner/Backend/miner-program
    fi

    if ! command -v git-lfs &> /dev/null; then
        echo 'git-lfs could not be found, installing...'
        if command -v sudo &> /dev/null; then
            curl -s https://packagecloud.io/install/repositories/github/git-lfs/script.deb.sh | sudo bash
            sudo apt-get install git-lfs -y
        else:
            curl -s https://packagecloud.io/install/repositories/github/git-lfs/script.deb.sh | bash
            apt-get install git-lfs -y
        fi
        git lfs install
    else
        echo 'git-lfs is already installed'
    fi

    if [ ! -d 'venv' ]; then
        python3 -m venv venv
    fi

    source venv/bin/activate
    python -m pip install --upgrade pip
    python -m pip install -r requirements.txt
    python auth/trainer.py --username {username} --password {password} --wallet_address {wallet_address}
    """

    run_command(["ssh", "-t", ssh_details, ssh_command], shell=True)

if __name__ == "__main__":
    logging.info("Starting miner setup script.")
    
    # Expecting arguments: username, password, wallet_address, environment (Local or RunPod), sshDetails (optional)
    if len(sys.argv) < 5:
        logging.error("Insufficient arguments provided.")
        print("Usage: miner_setup.py <username> <password> <wallet_address> <environment> [sshDetails]")
        sys.exit(1)

    username = sys.argv[1]
    password = sys.argv[2]
    wallet_address = sys.argv[3]
    environment = sys.argv[4].lower()

    logging.info(f"Received parameters: username={username}, environment={environment}")

    if environment == "local":
        # Modify this path to your server's directory
        miner_dir = os.path.join(os.getcwd(), 'workers')  # Default to the 'workers' directory inside the server
        if len(sys.argv) > 5:
            miner_dir = os.path.join(os.getcwd(), 'workers', sys.argv[5])  # Custom directory if provided
        logging.info(f"Running in local environment with miner_dir: {miner_dir}")
        run_local(username, password, wallet_address, miner_dir)

    elif environment == "runpod":
        if len(sys.argv) < 6:
            logging.error("SSH details are required for RunPod environment.")
            print("SSH details are required for RunPod environment.")
            sys.exit(1)
        ssh_details = sys.argv[5]
        logging.info("Running in RunPod environment.")
        run_remote(ssh_details, username, password, wallet_address)

    else:
        logging.error("Invalid environment specified.")
        print("Invalid environment. Please specify 'Local' or 'RunPod'.")
        sys.exit(1)
