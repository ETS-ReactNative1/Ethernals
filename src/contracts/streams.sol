// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

contract Streams {
  uint256 public streamCount = 0;
  string public name = "Streams";
  mapping(uint256 => stream) public streams;

  struct stream {
    uint256 id;
    string streamURL;
    string title;
    string img_hash;
    string date;
    string description;
    address author;
    bool isActive;
  }

  event StreamPublished(
    uint256 id,
    string streamURL,
    string title,
    string date,
    string img_hash,
    string description,
    address author,
    bool isActive
  );

  constructor() {}

  function publishStream(
    string memory _imgHash,
    string memory _title,
    string memory _date,
    string memory _streamUrl,
    string memory _description,
    bool _isActive
  ) public {
    // Make sure the video hash exists
    require(bytes(_imgHash).length > 0);
    // Make sure video title exists
    require(bytes(_streamUrl).length > 0);
    require(bytes(_description).length > 0);
    require(bytes(_title).length > 0);
    // Make sure uploader address exists
    require(msg.sender != address(0));

    // Increment video id
    streamCount++;

    // Add video to the contract
    streams[streamCount] = stream(
      streamCount,
      _streamUrl,
      _title,
      _date,
      _imgHash,
      _description,
      msg.sender,
      _isActive
    );
    // Trigger an event
    emit StreamPublished(
      streamCount,
      _imgHash,
      _title,
      _date,
      _streamUrl,
      _description,
      msg.sender,
      _isActive
    );
  }
}
