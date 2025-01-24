import { Box } from "@mui/material";

const UserImage = ({ image, size = "60px" }) => {

  console.log("size---00", size);
  
  return (
    <Box width={size} height={size}>
      <img
        className="h-[55px] w-[55px]"
        style={{ objectFit: "cover", borderRadius: "50%" }}
        width={size}
        height={size}
        alt="user"
        src={`${image}`}
      />
    </Box>
  );
};

export default UserImage;