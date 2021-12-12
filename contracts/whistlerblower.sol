// SPDX-License-Identifier: MIT
pragma solidity >=0.8.10 <0.9.0;

contract whistlerblower {
  // Name
  string public name = 'WhistleBlower';//no need
  // Number of posts
  uint public postCount = 0;
  // Mapping fileId=>Struct 
  mapping( uint => Post) public posts;

  // Struct
  struct Post{
   uint postId;
   string postHash;
   string postTitle;
   string postCategory;
   string postDescription;
   uint upvotes;
   uint downvotes;
   uint uploadTime;
   string[] comments;
   address payable uploader; 
  }


  // Event
  event PostUploaded(
    uint postId,
    string postHash,
    string postTitle,
    string postCategory,
    string postDescription,
    uint upvotes,
    uint downvotes,
    uint uploadTime,
    string[] comments,
    address payable uploader
  );
 
  function postUpvoted(uint _postId) public {
    posts[_postId].upvotes++;
  }
  function postDownvoted(uint _postId) public {
    posts[_postId].downvotes++;
  }

  function addComment(uint _postId, string memory _comment) public{
      posts[_postId].comments.push(_comment);
  }

//   function getComment(uint _id,uint i) public view returns(string memory){
//       return posts[_id].comments[i];
//   }

  // Upload post function
  function uploadPost(string memory _postHash,string memory _postTitle,string memory _postCategory,string memory _postDescription) public  {
    // Make sure the post hash exists
      require(bytes(_postHash).length > 0);
    // Make sure  postTitle exists
      require(bytes(_postTitle).length > 0);
    // Make sure  postTitle exists
      require(bytes(_postCategory).length > 0);
    // Make sure post description exists
      require(bytes(_postDescription).length > 0);
    // Make sure uploader address exists
      require(msg.sender!=address(0));

    // Increment post id
    postCount++;
    string[] memory vector;
    // Add Post to the contract
    posts[postCount] = Post(postCount, _postHash, _postTitle, _postCategory, _postDescription,0,0,block.timestamp,vector,payable(msg.sender));

    // Trigger an event
    emit PostUploaded(postCount, _postHash, _postTitle, _postCategory, _postDescription,0,0,block.timestamp,vector,payable(msg.sender));
  }

}
