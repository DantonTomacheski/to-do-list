
import { render, screen, fireEvent, act } from "@testing-library/react";
import { vi } from "vitest";

// First define the mocks - these need to be before any module imports
vi.mock('@/utils/imageCompression', () => ({
  compressImageToBase64: vi.fn().mockResolvedValue('test-compressed-image-base64')
}));

vi.mock('@/store/userStore', () => ({
  useUserStore: {
    getState: vi.fn().mockReturnValue({
      updateUser: vi.fn()
    })
  }
}));

// Now import the component
import PhotoUpload from "../PhotoUpload";

// Get reference to the updateUser mock for assertions
const mockUpdateUser = vi.mocked(await import('@/store/userStore')).useUserStore.getState().updateUser;

describe("PhotoUpload", () => {
  it("renders with default avatar when no value is provided", () => {
    const handleChange = vi.fn();
    render(<PhotoUpload onChange={handleChange} />);

    // Should show default avatar
    const defaultAvatar = screen.getByAltText("defaultAvatar");
    expect(defaultAvatar).toBeInTheDocument();
    expect(defaultAvatar).toHaveAttribute(
      "src",
      "https://avatar.iran.liara.run/public/2"
    );

    // Should have upload button
    const uploadButton = screen.getByText("uploadPhoto");
    expect(uploadButton).toBeInTheDocument();

    // Should not have remove button
    expect(screen.queryByLabelText("removePhoto")).not.toBeInTheDocument();
  });

  it("renders with provided photo value", () => {
    const handleChange = vi.fn();
    render(<PhotoUpload onChange={handleChange} value="test-image-url.jpg" />);

    // Should show the provided image
    const profileImage = screen.getByAltText("Profile");
    expect(profileImage).toBeInTheDocument();
    expect(profileImage).toHaveAttribute("src", "test-image-url.jpg");

    // Should have remove button
    const removeButton = screen.getByLabelText("removePhoto");
    expect(removeButton).toBeInTheDocument();
  });

  it("triggers file input when upload button is clicked", () => {
    const handleChange = vi.fn();
    render(<PhotoUpload onChange={handleChange} />);

    const fileInput = document.querySelector(
      'input[type="file"]'
    ) as HTMLInputElement;
    const clickSpy = vi.spyOn(fileInput, "click");

    // Click the upload button
    fireEvent.click(screen.getByText("uploadPhoto"));

    expect(clickSpy).toHaveBeenCalled();
  });

  it('calls onChange and updates user store when file is uploaded', async () => {
    // Reset all mocks before the test
    vi.clearAllMocks();
    
    const handleChange = vi.fn();
    render(<PhotoUpload onChange={handleChange} />);
    
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    
    // Create a test file
    const file = new File(['test'], 'test.png', { type: 'image/png' });
    const fileList = {
      0: file,
      length: 1,
      item: () => file
    };
    
    // Mock the FileList
    Object.defineProperty(fileInput, 'files', {
      value: fileList
    });
    
    // Trigger file change
    await act(async () => {
      fireEvent.change(fileInput);
    });
    
    // Should call onChange with compressed image
    expect(handleChange).toHaveBeenCalledWith('test-compressed-image-base64');
    
    // Should call updateUser in the store
    expect(mockUpdateUser).toHaveBeenCalledWith({ photo: 'test-compressed-image-base64' });
  });

  it("removes photo when remove button is clicked", () => {
    // Reset all mocks before the test
    vi.clearAllMocks();
    
    const handleChange = vi.fn();
    render(
      <PhotoUpload 
        onChange={handleChange} 
        value="test-image-url.jpg"
      />
    );
    
    // Click the remove button
    fireEvent.click(screen.getByLabelText('removePhoto'));
    
    // Should call onChange with null
    expect(handleChange).toHaveBeenCalledWith(null);
    
    // Should check that the store was updated
    expect(mockUpdateUser).toHaveBeenCalledWith({ photo: null });
  });

  it("applies custom className when provided", () => {
    const handleChange = vi.fn();
    render(
      <PhotoUpload 
        onChange={handleChange} 
        className="custom-class"
      />
    );
    
    // Look for the main container and check its classes
    const container = screen.getByRole('button', { name: 'uploadPhoto' }).closest('div.flex.flex-col');
    expect(container).toHaveClass('custom-class');
  });
});
